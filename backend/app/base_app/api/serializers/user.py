from typing import Any
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers as SR

from ...models import User, UserProfile

from .mixins import DynamicFieldsMixin
from .common import ModelValidationSerializer, NestedModelCommonSerializer
from .image import CompImageSerializer


class UserRegisterSerializer(ModelValidationSerializer):

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

    def validate(self, attrs: dict[str, Any]):
        if attrs.get("password") != attrs.get("password_confirm"):
            raise SR.ValidationError(_("Passwords don't match"))
        return attrs

    def commit_save(self, instance: User, validated_data):
        instance.set_password(validated_data["password"])
        instance.save()
        profile = instance.profile  # type: ignore
        profile.photo
        profile.header_image
        return instance


class ProfileSerializer(DynamicFieldsMixin, NestedModelCommonSerializer):

    photo = CompImageSerializer()
    header_image = CompImageSerializer()

    class Meta:
        model = UserProfile
        fields = ("photo", "header_image", "city", "country", "bio")


class UserSerializer(DynamicFieldsMixin, NestedModelCommonSerializer):

    profile = ProfileSerializer()

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


class PublicUserSerializer(UserSerializer):
    default_include = {
        "id": None,
        "username": None,
        "profile": ("photo",),
    }


class UserSessionSerializer(UserSerializer):
    default_include = {
        "id": None,
        "username": None,
        "email": None,
        "profile": ("photo",),
    }


class UserProfileSerializer(UserSerializer):
    followers = SR.SerializerMethodField()
    following = SR.SerializerMethodField()

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + (
            "followers",
            "following",
            "followers_count",
            "following_count",
        )

    def get_followers(self, user: User):
        limit = int(self.context["request"].query_params.get("followers_limit", "0"))
        if limit and user.followers_count:
            return PublicUserSerializer(
                list(user.followers.fetch_public()[:limit]), many=True
            ).data

    def get_following(self, user: User):
        limit = int(self.context["request"].query_params.get("following_limit", "0"))
        if limit and user.following_count:
            return PublicUserSerializer(
                list(user.following.fetch_public()[:limit]), many=True
            ).data
