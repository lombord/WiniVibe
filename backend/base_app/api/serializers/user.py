from django.utils.translation import gettext_lazy as _
from rest_framework import serializers as SR

from ...models import User, UserProfile

from .mixins import ModelValidationMixin, DynamicFieldsMixin
from .fields import CompImageField


class UserRegisterSerializer(ModelValidationMixin, SR.ModelSerializer):

    password_confirm = SR.CharField(
        max_length=100, label="Confirm Password", write_only=True
    )

    class Meta:
        model = User
        fields = ("username", "email", "password", "password_confirm")
        extra_kwargs = {
            "password": {
                "help_text": _("Your password must contain at least 8 characters."),
                "write_only": True,
            },
        }
        exclude_on_validation = ("password_confirm", "password")

    def validate(self, attrs: dict[str]):
        if attrs.get("password") != attrs.get("password_confirm"):
            raise SR.ValidationError(_("Passwords didn't match"))
        return attrs

    def save_instance(self, instance: User, validated_data):
        instance.set_password(validated_data["password"])
        instance.save()
        return instance


class UserProfileSerializer(DynamicFieldsMixin, SR.ModelSerializer):

    photo = CompImageField()
    header_image = CompImageField()

    class Meta:
        model = UserProfile
        fields = ("photo", "header_image", "city", "country", "bio")


class UserSerializer(DynamicFieldsMixin, ModelValidationMixin, SR.ModelSerializer):

    profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "status",
            "profile",
        )

    def custom_update(self, instance: User, validated_data: dict[str]):
        profile = validated_data.pop("profile", None)
        if profile:
            self.fields["profile"].update(instance.profile, profile)
        return super().custom_update(instance, validated_data)


SESSION_KWARGS = {
    "exclude": {
        "profile": {"include": ("photo",)},
        "first_name": None,
        "last_name": None,
    }
}


class UserSessionSerializer(UserSerializer):

    def __init__(self, *args, **kwargs):
        kwargs.update(SESSION_KWARGS)
        super().__init__(*args, **kwargs)
