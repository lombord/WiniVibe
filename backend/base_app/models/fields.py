from django.db import models, transaction
from django.db.models import signals
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _

from django.db.models.fields.related_descriptors import (
    ReverseOneToOneDescriptor,
    ForwardOneToOneDescriptor,
)
from django.core.files import File


class SaveRelated:

    def __init__(self, instance: models.Model, related: models.Model) -> None:
        self.instance = instance
        self.related = related

    def __call__(self, sender, instance: models.Model, **kwds):
        if instance is self.instance:
            self.related.save()
            assert signals.post_save.disconnect(self, sender), "receiver is not removed"


class AutoReverseDescriptor(ReverseOneToOneDescriptor):

    @transaction.atomic
    def __get__(self, instance: models.Model, cls=None):
        model = getattr(self.related, "related_model", self.related.model)
        try:
            return super().__get__(instance, cls)
        except self.RelatedObjectDoesNotExist:

            # if instance has pk then try to create the related object
            if instance.pk:
                obj, _ = model.objects.get_or_create(
                    **{self.related.field.name: instance}
                )
            # else create related without saving it until instance is created
            else:
                obj = model(**{self.related.field.name: instance})
                signals.post_save.connect(SaveRelated(instance, obj), type(instance))

            # Update Django's cache, otherwise first 2 calls to obj.relobj
            # will return 2 different in-memory objects
            self.related.set_cached_value(instance, obj)
            self.related.field.set_cached_value(obj, instance)
            return obj


class AutoForwardDescriptor(ForwardOneToOneDescriptor):

    def __get__(self, instance, cls=None):
        rel_obj = super().__get__(instance, cls)

        if rel_obj is None and instance:
            try:
                with transaction.atomic():
                    rel_obj = self.field.related_model.objects.create()
                    setattr(instance, self.field.name, rel_obj)
                    instance.save()
            except Exception as e:
                print(e)

        return rel_obj


class AutoOneToOneField(models.OneToOneField):
    related_accessor_class = AutoReverseDescriptor
    forward_related_accessor_class = AutoForwardDescriptor


class ImageReverseDescriptor(AutoReverseDescriptor):

    def __set__(self, instance: models.Model, value: models.Model | None) -> None:
        if isinstance(value, File):
            image_obj = getattr(instance, self.related.name)
            image_obj.large = value
            image_obj.clean()
            if image_obj.pk:
                image_obj.save()
            return
        return super().__set__(instance, value)


class ImageOneToOneField(AutoOneToOneField):
    """Compressed image file field"""

    related_accessor_class = ImageReverseDescriptor


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
