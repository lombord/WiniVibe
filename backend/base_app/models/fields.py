from django.db import models


class CompImageField(models.OneToOneField):

    def __init__(self, *args, **kwargs):
        kwargs["related_name"] = "referring"
        super().__init__(*args, **kwargs)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        kwargs.pop("related_name", None)
        return name, path, args, kwargs
