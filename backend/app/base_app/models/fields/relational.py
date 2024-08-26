from django.db import models, transaction
from django.db.models import signals


from django.db.models.fields.related_descriptors import (
    ReverseOneToOneDescriptor,
    ForwardOneToOneDescriptor,
)


class SaveRelated:

    def __init__(self, instance: models.Model, related: models.Model) -> None:
        self.instance = instance
        self.related = related

    def __call__(self, sender, instance: models.Model, **kwargs):
        if instance == self.instance:
            self.related.save()
            assert signals.post_save.disconnect(self, sender), "receiver is not removed"


class AutoReverseDescriptor(ReverseOneToOneDescriptor):

    def __get__(self, instance: models.Model, cls=None):
        try:
            return super().__get__(instance, cls)
        except self.RelatedObjectDoesNotExist as exc:
            try:
                with transaction.atomic():
                    model = self.related.related_model
                    data = {self.related.field.name: instance}
                    # if instance has pk then try to create the related object
                    if instance.pk:
                        obj, _ = model.objects.get_or_create(**data)
                    # else create related without saving it until instance is created
                    else:
                        obj = model(**data)
                        signals.post_save.connect(
                            SaveRelated(instance, obj), type(instance)
                        )

                    # Update Django's cache, otherwise first 2 calls to obj.relobj
                    # will return 2 different in-memory objects
                    self.related.set_cached_value(instance, obj)
                    self.related.field.set_cached_value(obj, instance)
                    return obj
            except Exception:
                raise exc


class AutoForwardDescriptor(ForwardOneToOneDescriptor):

    def __get__(self, instance: models.Model, cls=None):
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


class CompImageForwardDescriptor(AutoForwardDescriptor):

    def __set__(self, instance: models.Model, value):
        if isinstance(value, str):
            image_obj = getattr(instance, self.field.name)
            image_obj.large = value
            return
        super().__set__(instance, value)


class AutoCompImageOneToOneField(AutoOneToOneField):
    forward_related_accessor_class = CompImageForwardDescriptor
