from typing import Any, Dict, Iterable, Tuple, Union

from rest_framework import serializers as SR


class NestedModelUpdateMixin(SR.ModelSerializer):

    def _update_nested(self, instance: Any, validated_data: Dict[str, Any], **kwargs):
        fields = self.fields

        nested_fields = {}

        for key in validated_data:
            field = fields.get(key)
            if field and not field.read_only and isinstance(field, SR.ModelSerializer):
                nested_fields[key] = field

        for key, field in nested_fields.items():
            data = validated_data.pop(key, None)
            if data is not None:
                field.update(getattr(instance, key), data, **kwargs)


FieldSelect = Union[Tuple[str], Dict[str, "FieldSelect"], None]


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
        if not (include or exclude):
            return

        assert not (include and exclude), "Can't have both include and exclude!"

        fields = self.fields

        if include:
            include = self._ensure_dict(include)
            exclude = self._exclude_from_include(include, fields)
        else:
            exclude = self._ensure_dict(exclude)

        for name, value in exclude.items():
            if isinstance(value, dict):
                fields.get(name)._filter_fields(**value)
            elif isinstance(value, (list, tuple)):
                fields.get(name)._filter_fields(include=value)
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
