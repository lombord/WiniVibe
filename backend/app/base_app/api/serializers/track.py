from django.utils.translation import gettext_lazy as _
from rest_framework import serializers as SR

from ...models import Track

from .mixins import DynamicFieldsMixin
from .common import ModelValidationSerializer
from .image import CompImageSerializer


class TrackSerializer(DynamicFieldsMixin, ModelValidationSerializer):

    cover_image = CompImageSerializer()

    class Meta:
        model = Track
        fields = (
            "id",
            "uuid",
            "title",
            "slug",
            "uploaded_by",
            "tags",
            "description",
            "is_public",
            "cover_image",
            "track",
            "metadata",
        )
        read_only_fields = ("uploaded_by", "slug", "metadata", "tags")
