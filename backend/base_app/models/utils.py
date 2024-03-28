import os
from uuid import uuid4
from pathlib import Path


from django.utils.deconstruct import deconstructible
from django.template.defaultfilters import filesizeformat
from django.core.exceptions import ValidationError
from django.core.files import File


@deconstructible
class DynamicPath:

    def __init__(self, pattern: str, obj_name="obj", ext=None) -> None:
        self.pattern = pattern
        self.obj_name = obj_name
        self.ext = ext

    def __call__(self, obj, name: str) -> Path:
        ext = self.ext or os.path.splitext(name)[-1]
        name = uuid4().hex
        return Path(self.pattern.format(obj, **{self.obj_name: obj}), f"{name}{ext}")


@deconstructible
class FileValidator:
    error_messages = {
        "max_size": (
            "Ensure this file size is not greater than %(max_size)s."
            " Your file size is %(size)s."
        ),
        "min_size": (
            "Ensure this file size is not less than %(min_size)s. "
            "Your file size is %(size)s."
        ),
        "content_type": "Files of type %(content_type)s are not supported.",
    }

    def __init__(self, max_size=None, min_size=None, content_types=()):
        self.max_size = max_size
        self.min_size = min_size
        self.content_types = (
            content_types if isinstance(content_types, set) else set(content_types)
        )

    def __call__(self, data: File):
        if self.max_size is not None and data.size > self.max_size:
            params = {
                "max_size": filesizeformat(self.max_size),
                "size": filesizeformat(data.size),
            }
            raise ValidationError(self.error_messages["max_size"], "max_size", params)

        if self.min_size is not None and data.size < self.min_size:
            params = {
                "min_size": filesizeformat(self.min_size),
                "size": filesizeformat(data.size),
            }
            raise ValidationError(self.error_messages["min_size"], "min_size", params)
        if self.content_types:
            try:
                content_type = data.file.content_type
                if content_type not in self.content_types:
                    params = {"content_type": content_type}
                    raise ValidationError(
                        self.error_messages["content_type"], "content_type", params
                    )
            except AttributeError:
                pass

    def __eq__(self, other):
        return (
            isinstance(other, FileValidator)
            and self.max_size == other.max_size
            and self.min_size == other.min_size
            and self.content_types == other.content_types
        )
