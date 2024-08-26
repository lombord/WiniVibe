from typing import Type
from django.db import models as dj_models

from ..utils import create_model

from .types import ImageConfig
from .models import CompressedImage
from ..fields import AutoOneToOneField

# dictionary of child models of CompressedImage model
CHILD_MODELS: dict[str, Type[dj_models.Model]] = {}


class CompImageField:
    """Compressed image field(descriptor)"""

    def __init__(
        self,
        upload_key_path: str,
    ) -> None:
        self.config: ImageConfig = {"upload_key_path": upload_key_path}

    @classmethod
    def _camel_to_pascal(cls, name: str):
        return "".join(n.title() for n in name.split("_"))

    def get_model_name(self, cls: type, name: str):
        return f"{cls.__name__}{self._camel_to_pascal(name)}"

    def get_model(self, cls: type, name: str):
        model_name = self.get_model_name(cls, name)
        model = CHILD_MODELS.get(model_name)
        if model is not None:
            return model

        fields = {"CONFIG": self.config}
        options = {"proxy": True}

        model = create_model(
            name=model_name,
            fields=fields,
            module=cls.__module__,
            bases=(CompressedImage,),
            options=options,
            admin_opts={},
        )

        CHILD_MODELS[model_name] = model
        return model

    def contribute_to_class(self, cls: type, name: str):
        model = self.get_model(cls, name)

        related_field = AutoOneToOneField(
            to=model,
            on_delete=dj_models.SET_NULL,
            null=True,
            blank=True,
            related_name="+",
        )

        related_field.contribute_to_class(cls, name)
