from rest_framework import serializers as SR

from ...models import CompressedImage

from .common import ModelValidationSerializer


class CompImageSerializer(ModelValidationSerializer):

    class Meta:
        model = CompressedImage
        fields = ("small", "medium", "large", "extracted_color", "image_key")
        read_only_fields = ("small", "medium", "large")
        extra_kwargs = {"image_key": {"write_only": True}}
