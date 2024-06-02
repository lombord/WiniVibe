from contextlib import contextmanager
from typing import Iterable, Union

from rest_framework import serializers as SR
from django.db import transaction, IntegrityError
from django.core.exceptions import ValidationError


@contextmanager
def validation_manager():
    try:
        with transaction.atomic():
            yield
    except (SR.ValidationError, ValidationError) as exc:
        raise SR.ValidationError(detail=SR.as_serializer_error(exc))
    except IntegrityError as error:
        raise SR.ValidationError from error


class ModelValidationMixin:
    """Mixin to add model level validation to serializers"""

    class Meta:
        exclude_on_validation = None

    def create(self, validated_data: dict):
        with validation_manager():
            clean_data = dict(validated_data)
            exclude = getattr(self.Meta, "exclude_on_validation", None)
            if exclude:
                for key in exclude:
                    clean_data.pop(key, None)
            instance = self.Meta.model(**clean_data)
            self._validate_instance(instance)
            return self.save_instance(instance, validated_data)

    def _validate_instance(self, instance):
        instance.clean()
        instance.validate_unique()
        instance.validate_constraints()

    def update(self, instance, validated_data):
        with validation_manager():
            instance = self.custom_update(instance, validated_data)
            self._validate_instance(instance)
            instance.save()
            return instance

    def custom_update(self, instance, validated_data):
        return super().update(instance, validated_data)

    def save_instance(self, instance, validated_data):
        """Hook to save instance"""
        instance.save()
        return instance


FieldSelect = Union[tuple[str], dict[str, dict | None]]


class DynamicFieldsMixin:
    """
    Mixin to add dynamic fields feature
    """

    default_include: FieldSelect = None
    default_exclude: FieldSelect = None

    def __init__(
        self,
        *args,
        include: FieldSelect = None,
        exclude: FieldSelect = None,
        **kwargs,
    ):
        super().__init__(*args, **kwargs)
        include = include or self.default_include
        exclude = exclude or self.default_exclude
        if exclude or include:
            self._filter_fields(include, exclude)

    def _filter_fields(
        self,
        include: FieldSelect = None,
        exclude: FieldSelect = None,
    ):
        assert not (include and exclude), "Can't have both include and exclude!"
        if exclude or include:
            fields = self.fields
            if include:
                include = self._ensure_dict(include)
                exclude = self._exclude_from_include(include, fields)
            else:
                exclude = self._ensure_dict(exclude)
            for name, kwargs in exclude.items():
                if isinstance(kwargs, dict):
                    fields.get(name)._filter_fields(**kwargs)
                else:
                    fields.pop(name, None)

    def _exclude_from_include(self, include, fields):
        exclude = {}
        for key in fields:
            kwargs = include.get(key, 0)
            if kwargs is not None:
                exclude[key] = kwargs or None
        return exclude

    def _ensure_dict(self, iterable: Iterable[str]):
        return iterable if isinstance(iterable, dict) else dict.fromkeys(iterable)
