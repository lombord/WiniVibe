from shutil import rmtree

from io import BytesIO
import os
from uuid import uuid4
from pathlib import Path
from PIL import Image, ImageOps

from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.deconstruct import deconstructible
from django.utils.functional import cached_property

from django.core.files import File
from django.core.exceptions import ValidationError
from django.template.defaultfilters import filesizeformat
from django.dispatch import receiver


class CommentBase(models.Model):

    content = models.TextField(_("Comment content"))
    created = models.DateTimeField(_("Created date"), auto_now_add=True)
    edited = models.DateTimeField(_("Created date"), auto_now=True)

    class Meta:
        abstract = True


@deconstructible
class CompImagePath:
    """Multi size image path"""

    def __init__(self, size: str = "small") -> None:
        self.size = size

    def __call__(self, instance: "CompressedImage", name: str) -> str:
        ext = os.path.splitext(name)[-1]
        name = f"{uuid4().hex}_{self.size}"
        return Path(instance._save_directory, f"{name}{ext}")


class CompressedImage(models.Model):
    """Compressed Images field"""

    DEFAULT_MAX_SIZE = 1024 * 1024 * 20
    COMP_CONFIG = {
        "path": None,
        "sizes": {"large": None, "medium": None, "small": None},
    }

    small = models.ImageField(
        _("Small Image"),
        upload_to=CompImagePath(size="small"),
        max_length=255,
        blank=True,
        null=True,
    )
    medium = models.ImageField(
        _("Medium Image"),
        upload_to=CompImagePath(size="medium"),
        max_length=255,
        blank=True,
        null=True,
    )
    large = models.ImageField(
        _("Large Image"),
        upload_to=CompImagePath(size="large"),
        max_length=255,
        blank=True,
        null=True,
    )

    class Meta:
        abstract = True

    @cached_property
    def _save_directory(self):
        pattern: str = self.COMP_CONFIG["path"]
        return pattern.format(obj=self.referring)

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.__old_file = self.large

    def save(self, *args, **kwargs):
        if self.large and self.large != self.__old_file:
            if self.__old_file:
                self.clear_files()
            self.compress_images(self.large)

        super().save(*args, **kwargs)

    def compress_images(self, file: File):
        config = self.COMP_CONFIG
        sizes: dict[str, tuple[int, int]] = config.get("sizes")
        quality = config.get("quality", 70)
        large = sizes.get("large")
        sizes.setdefault("medium", (large[0] // 2, large[1] // 2))
        sizes.setdefault("small", (large[0] // 4, large[1] // 4))
        self._resize_images(file, sizes, quality)

    def clean(self) -> None:
        max_size = self.COMP_CONFIG.get("max_size", self.DEFAULT_MAX_SIZE)
        if self.large and self.large.size > max_size:
            raise ValidationError(
                _("Image size should be less or equal to %s") % filesizeformat(max_size)
            )

    def _resize_images(
        self, file: File, sizes: dict[str, tuple[int, int]], quality: int
    ):
        with Image.open(file) as img:
            if img.mode != "RGB":
                img = img.convert("RGB")
            for key, size in sizes.items():
                if size:
                    img_io = BytesIO()
                    resized = ImageOps.fit(img, size)
                    resized.save(img_io, "JPEG", quality=quality)
                    setattr(self, key, File(img_io, f"{key}.jpg"))

    def clear_files(self):
        try:
            rmtree(Path(self.__old_file.path).parent.resolve(), ignore_errors=True)
        except Exception as e:
            print(e)


@receiver(models.signals.pre_delete, sender=CompressedImage)
def cleanup_images(sender, instance: CompressedImage, **kwargs):
    instance.clear_files()
