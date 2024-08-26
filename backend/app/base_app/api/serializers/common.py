from contextlib import contextmanager
from typing import Any, Dict

from rest_framework import serializers as SR
from django.db import transaction, IntegrityError
from django.core.exceptions import ValidationError

from .mixins import NestedModelUpdateMixin


@contextmanager
def validation_manager(use_transaction=True):
    try:
        if use_transaction:
            with transaction.atomic():
                yield
        else:
            yield
    except (SR.ValidationError, ValidationError) as exc:
        raise SR.ValidationError(detail=SR.as_serializer_error(exc))
    except IntegrityError as error:
        raise SR.ValidationError from error


InstanceData = Dict[str, Any]


class ModelValidationSerializer(SR.ModelSerializer):
    """Mixin to add model level validation to serializers"""

    class Meta:
        exclude_on_validation = None

    def _validate_instance(self, instance):
        instance.clean()
        instance.validate_unique()
        instance.validate_constraints()

    def create(self, validated_data: InstanceData, *, user_transaction=True):
        with validation_manager(user_transaction):
            clean_data = dict(validated_data)
            exclude = getattr(self.Meta, "exclude_on_validation", None)
            if exclude:
                for key in exclude:
                    clean_data.pop(key, None)
            instance = self.Meta.model(**clean_data)
            self._validate_instance(instance)
            return self.commit_save(instance, validated_data)

    def update_instance(self, instance, data: InstanceData):
        for attr, value in data.items():
            setattr(instance, attr, value)
        return True

    def update(self, instance, validated_data: InstanceData, *, user_transaction=True):
        with validation_manager(user_transaction):
            is_changed = self.update_instance(instance, validated_data)
            if not is_changed:
                return instance
            self._validate_instance(instance)
            return self.commit_update(instance, validated_data)

    def commit_update(self, instance, validated_data: InstanceData):
        """Hook to commit instance update"""

        instance.save()
        return instance

    def commit_save(self, instance, validated_data: InstanceData):
        """Hook to commit instance save"""
        instance.save()
        return instance


class NestedModelCommonSerializer(NestedModelUpdateMixin, ModelValidationSerializer):

    def update_instance(self, instance, validated_data: InstanceData):
        self._update_nested(instance, validated_data, user_transaction=False)
        if not validated_data:
            return False
        return super().update_instance(instance, validated_data)
