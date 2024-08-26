from typing import Optional, Type, Tuple
import re

from django.db import models, transaction
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_delete
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError


from ...tasks.s3_tasks import commit_new_image, delete_s3_dir
from ...tasks.s3_manager import S3Manager

from ..fields import ColorField, S3FileField, S3FieldFile
from ..fields.string_fields import hex_color_validator


from .types import ImageConfig


def on_image_commit(old_key: Optional[str], instance: "CompressedImage"):
    if old_key and not S3Manager.UNUSED_RE.match(old_key):
        delete_s3_dir.apply_async(
            (old_key,),
            task_id=f"compressed-image-del:{old_key}",
            countdown=60,
        )
    if instance.image_key:
        commit_new_image.apply_async(
            (instance.pk,),
            task_id=f"compressed-image-new:{instance.pk}",
            countdown=60,
        )


BASE_UPLOAD_FILES_PREFIX = "unused/"


class CompressedImage(models.Model):
    """Compressed Images field"""

    CONFIG: ImageConfig
    BASE_IMAGE_PREF: str = f"{BASE_UPLOAD_FILES_PREFIX}images"
    IMAGE_OBJECT_KEY_RE: str = r"^[a-f0-9]{40}$"
    IMAGE_FIELD_KEYS: Tuple[str, str, str] = ("small", "medium", "large")

    _image_key_pattern: str
    __og_image_key: Optional[str]

    image_key = models.CharField(
        _("S3 bucket object key"),
        max_length=255,
        blank=True,
        null=True,
        validators=[
            RegexValidator(
                regex=IMAGE_OBJECT_KEY_RE,
                message=_("Invalid image object key"),
                flags=re.ASCII,
            )
        ],
    )

    small: S3FieldFile = S3FileField(_("Small Image"))  # type: ignore

    medium: S3FieldFile = S3FileField(_("Medium Image"))  # type: ignore

    large: S3FieldFile = S3FileField(_("Large Image"))  # type: ignore

    extracted_color = ColorField(_("Extracted Color"), blank=True, null=True)

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.__og_image_key = self.image_key

    @property
    def og_image_key(self):
        return self.__og_image_key

    @property
    def is_new_image(self) -> bool:
        try:
            return not self.pk or self.__og_image_key != self.image_key
        except (AttributeError, ValueError, TypeError):
            return False

    @classmethod
    def img_key_pattern(cls) -> str:
        pattern = getattr(cls, "_image_key_pattern", None)
        if not pattern:
            try:
                upload_prefix = cls.CONFIG["upload_key_path"]
            except (AttributeError, KeyError):
                upload_prefix = None

            pattern = (
                f"{cls.BASE_IMAGE_PREF}/"
                + (f"{upload_prefix}/" if upload_prefix else "")
                + "%s"
            )
            setattr(cls, "_image_key_pattern", pattern)

        return pattern

    def _commit_save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.__og_image_key = self.image_key

    def save(self, *args, **kwargs):
        if self.is_new_image:
            self.set_keys_from_token(self.image_key)
            old_key = self.__og_image_key
            transaction.on_commit(lambda: on_image_commit(old_key, self))

        self._commit_save(*args, **kwargs)

    def set_keys_from_token(self, token_key: Optional[str]):
        if token_key:
            self.image_key = self.img_key_pattern() % token_key
            self._update_image_keys()
        else:
            self._reset_image()

    def _reset_image(self):
        self.image_key = self.small = self.medium = self.large = self.extracted_color = None  # type: ignore

    def _update_image_keys(self):
        prefix = self.image_key
        self.small.set_obj_key(f"{prefix}/small.jpg")
        self.medium.set_obj_key(f"{prefix}/medium.jpg")
        self.large.set_obj_key(f"{prefix}/large.jpg")

    def set_valid_color(self, color: Optional[str]):
        if color is None:
            self.extracted_color = None
            return
        try:
            hex_color_validator(color)
            self.extracted_color = color
        except ValidationError:
            self.extracted_color = None

    def clear_files(self):
        image_key = self.__og_image_key
        if image_key:
            transaction.on_commit(lambda: delete_s3_dir.delay(image_key))


def image_deleted(sender: Type[CompressedImage], instance: CompressedImage, **kwargs):
    instance.clear_files()


post_delete.connect(image_deleted, CompressedImage)
