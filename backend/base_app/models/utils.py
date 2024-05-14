import os
from uuid import uuid4
from pathlib import Path


from django.contrib import admin
from django.db import models
from django.utils.deconstruct import deconstructible
from django.template.defaultfilters import filesizeformat
from django.core.exceptions import ValidationError
from django.core.files import File


def create_model(
    name,
    fields: dict[str, models.Field] = None,
    app_label: str = "",
    module: str = "",
    bases: dict[type] = (models.Model,),
    options: dict[str] = None,
    admin_opts=None,
):
    """Dynamically create a new model"""

    class Meta:
        # Using type('Meta', ...) gives a dictproxy error during model creation
        pass

    if app_label:
        # app_label must be set using the Meta inner class
        setattr(Meta, "app_label", app_label)

    # Update Meta with any options that were provided
    if options is not None:
        for key, value in options.iteritems():
            setattr(Meta, key, value)

    # Set up a dictionary to simulate declarations within a class
    attrs = {"__module__": module, "Meta": Meta}

    # Add in any fields that were provided
    if fields:
        attrs.update(fields)

    # Create the class, which automatically triggers ModelBase processing
    model = type(name, bases, attrs)

    # Create an Admin class if admin options were provided
    if admin_opts is not None:

        class Admin(admin.ModelAdmin):
            pass

        for key, value in admin_opts:
            setattr(Admin, key, value)
        admin.site.register(model, Admin)

    return model


@deconstructible
class DynamicPath:

    def __init__(self, pattern: str, name=None, ext=None, pass_as="obj") -> None:
        self.pattern = pattern
        self.name = name
        self.ext = ext
        self.pass_as = pass_as

    def __call__(self, obj, name: str) -> Path:
        ext = self.ext or os.path.splitext(name)[-1]
        name = self.name or uuid4().hex
        return Path(self.pattern.format(obj, **{self.pass_as: obj}), f"{name}{ext}")


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
