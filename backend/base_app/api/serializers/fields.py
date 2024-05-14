from rest_framework import serializers as SR


class CompImageField(SR.ImageField):

    def __init__(self, *args, **kwargs):
        kwargs["required"] = False
        super().__init__(*args, **kwargs)

    def to_representation(self, value):
        return {
            "small": super().to_representation(value.small),
            "medium": super().to_representation(value.medium),
            "large": super().to_representation(value.large),
        }
