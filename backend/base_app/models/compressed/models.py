import os
from io import BytesIO
from shutil import rmtree

from pathlib import Path
from PIL import Image, ImageOps

from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.deconstruct import deconstructible
from django.utils.functional import cached_property

from django.core.files import File
from django.core.exceptions import ValidationError
from django.template.defaultfilters import filesizeformat


from ..fields import ColorField, ImageOneToOneField
from ..config import IMG_EXTENSION, IMG_FORMAT, IMG_MODE

from .types import ImageConfig, ImageSizes
from .utils import dominant_color


@deconstructible
class CompImagePath:
    """Multi size image path"""

    def __init__(self, size: str = "small") -> None:
        self.size = size

    def __call__(self, instance: "CompressedImage", name: str) -> str:
        ext = os.path.splitext(name)[-1]
        name = self.size
        return Path(instance._save_directory, f"{name}{ext}")


def cleanup_images(sender, instance: "CompressedImage", **kwargs):
    instance.clear_files()


class CompressedImage(models.Model):
    """Compressed Images field"""

    DEFAULT_MAX_SIZE = 1024 * 1024 * 20
    CONFIG: ImageConfig = None

    # model where CompressedImage is used from
    referring: ImageOneToOneField = None

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

    extracted_color = ColorField(_("Extracted Color"), blank=True, null=True)

    class Meta:
        abstract = True

    def __init_subclass__(cls, *args, **kwargs) -> None:
        super().__init_subclass__(*args, **kwargs)
        models.signals.post_delete.connect(cleanup_images, cls)

    @cached_property
    def _save_directory(self):
        pattern = self.CONFIG["path"]
        return pattern.format(obj=self.referring)

    @property
    def extract_image(self):
        return self.small or self.medium or self.large

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.__old_file = self.large

    def save(self, *args, **kwargs):
        if self.large and self.large != self.__old_file:
            if self.__old_file:
                self.clear_files()
            self.compress_images(self.large)

        super().save(*args, **kwargs)

    def clean(self) -> None:
        max_size = self.CONFIG["max_size"]
        if self.large and self.large.size > max_size:
            raise ValidationError(
                _("Image size should be less or equal to %s") % filesizeformat(max_size)
            )

    def compress_images(self, file: File):
        config = self.CONFIG
        sizes = config["sizes"]
        quality = config["quality"]
        large = sizes["large"]
        sizes.setdefault("medium", (large[0] // 2, large[1] // 2))
        sizes.setdefault("small", (large[0] // 4, large[1] // 4))
        self.__resize_images(file, sizes, quality)
        if config["extract_color"]:
            self.__extract_color()

    def __resize_images(self, file: File, sizes: ImageSizes, quality: int):
        with Image.open(file) as img:
            if img.mode != IMG_MODE:
                img = img.convert(IMG_MODE)
            for key, size in sizes.items():
                if size:
                    img_io = BytesIO()
                    resized = ImageOps.fit(img, size)
                    resized.save(img_io, IMG_FORMAT, quality=quality)
                    setattr(self, key, File(img_io, f"{key}{IMG_EXTENSION}"))

    def clear_files(self):
        try:
            rmtree(Path(self.__old_file.path).parent.resolve(), ignore_errors=True)
            self.medium = self.small = None
        except Exception as e:
            print(e)

    def __extract_color(self):
        self.extracted_color = dominant_color(
            self.extract_image, resize=self.CONFIG["extract_resize"]
        )
