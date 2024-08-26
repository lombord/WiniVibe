from typing import cast
from django import forms
from django.db.models.base import Model
from django.db.models.fields.files import FileField, FieldFile, FileDescriptor
from django.utils.translation import gettext_lazy as _


# RegexFactory = Union[str, Callable[..., Union[str, re.Pattern[str]]]]


# @deconstructible
# class LazyRegexValidator:
#     _regex_factory: RegexFactory
#     _pattern: re.Pattern[str]

#     def __init__(
#         self,
#         regex_factory: RegexFactory,
#         flags: int = 0,
#         inverse_match: bool = False,
#         message=None,
#         code: Optional[str] = None,
#     ) -> None:
#         self._regex_factory = regex_factory
#         self.flags = flags
#         self.inverse_match = inverse_match
#         self.code = code
#         self.message = message

#     def _setup(self):
#         factory = self._regex_factory
#         if isinstance(factory, str):
#             return re.compile(factory, flags=self.flags)
#         if callable(factory):
#             pattern = factory()
#             if isinstance(pattern, str):
#                 return re.compile(pattern, flags=self.flags)
#             return pattern
#         return re.compile("")

#     @property
#     def pattern(self) -> re.Pattern[str]:
#         pattern = getattr(self, "_pattern", None)
#         if pattern is None:
#             pattern = self._pattern = self._setup()
#         return pattern

#     def __call__(self, value):
#         """
#         Validate that the input contains (or does *not* contain, if
#         inverse_match is True) a match for the regular expression.
#         """
#         pattern_matches = self.pattern.search(str(value))
#         invalid_input = pattern_matches if self.inverse_match else not pattern_matches
#         if invalid_input:
#             raise ValidationError(self.message, code=self.code, params={"value": value})

#     def __eq__(self, other):
#         return (
#             isinstance(other, LazyRegexValidator)
#             and (self._regex_factory == other._regex_factory)
#             and (self.flags == other.flags)
#             and (self.message == other.message)
#             and (self.code == other.code)
#             and (self.inverse_match == other.inverse_match)
#         )


class S3FieldFile(FieldFile):

    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self._obj_committed = True

    def set_obj_key(self, obj_key: str):
        self.name = obj_key
        self._obj_committed = False

    def save_obj_key(self, obj_key: str, save=True):
        self.name = obj_key

        setattr(self.instance, self.field.attname, self.name)

        self._obj_committed = self._committed = True

        # Save the object because it has changed, unless save is False
        if save:
            self.instance.save()


class S3FileDescriptor(FileDescriptor):

    def _set_from_key(self, instance: Model, obj_key: str):
        super().__set__(instance, obj_key)
        file = cast(S3FieldFile, self.__get__(instance))
        file.set_obj_key(obj_key)

    def __set__(self, instance: Model, value) -> None:
        if value and isinstance(value, str):
            filed_name = self.field.attname
            data = instance.__dict__
            is_new_file = False
            try:
                if value != data[filed_name]:
                    is_new_file = True
            except KeyError:
                is_new_file = not instance.pk

            if is_new_file:
                return self._set_from_key(instance, value)

        return super().__set__(instance, value)


class S3FileField(FileField):

    attr_class = S3FieldFile
    descriptor_class = S3FileDescriptor

    _default_invalid_message = _("Invalid s3 object key for this field")

    def __init__(
        self, *args, max_length: int = 255, null=True, blank=True, **kwargs
    ) -> None:
        kwargs["upload_to"] = ""

        super().__init__(
            *args,
            max_length=max_length,
            null=null,
            blank=blank,
            **kwargs,
        )

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()

        if kwargs.get("max_length") == 255:
            del kwargs["max_length"]

        kwargs.pop("upload_to", None)

        return name, path, args, kwargs

    def pre_save(self, model_instance, add) -> S3FieldFile:
        file: S3FieldFile = super().pre_save(model_instance, add)
        if file and not file._obj_committed:
            # Commit the file to storage prior to saving the model
            file.save_obj_key(file.name, save=False)
        return file

    def formfield(self, **kwargs):
        kwargs["widget"] = forms.widgets.Input
        return super().formfield(
            **{
                "form_class": forms.CharField,
                "max_length": self.max_length,
                **kwargs,
            }
        )
