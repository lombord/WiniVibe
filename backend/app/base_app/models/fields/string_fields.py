from django.db import models
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _


hex_color_validator = RegexValidator(
    r"^#(?:[0-9a-fA-F]{3}){1,2}$", message=_("Invalid hex color")
)


class ColorField(models.CharField):
    description = _("Hex Color field")
    default_validators = [hex_color_validator]

    def __init__(self, *args, **kwargs) -> None:
        kwargs["max_length"] = 7
        super().__init__(*args, **kwargs)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        del kwargs["max_length"]
        return name, path, args, kwargs
