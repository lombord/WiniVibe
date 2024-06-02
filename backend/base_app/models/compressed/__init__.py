from django.db import models as dj_models

from ..utils import create_model
from ..fields import ImageOneToOneField
from ..config import DEFAULT_IMG_QUALITY


from .types import ImageConfig, ImageSizes
from .models import CompressedImage

# dictionary of child models of CompressedImage model
CHILD_MODELS: dict[str, dj_models.Model] = {}


class CompImageField:
    """Compressed image field(descriptor)"""

    def __init__(
        self,
        path: str,
        sizes: ImageSizes,
        max_size: int = CompressedImage.DEFAULT_MAX_SIZE,
        quality: int = DEFAULT_IMG_QUALITY,
        extract_color: bool = False,
        extract_resize: bool = False,
    ) -> None:
        """Descriptor field creates new model for compressed images

        Args:
            path (str): _Path to store images_
            sizes (ImageSizes): _Compression sizes_
            max_size (int, optional): _Max size of uploaded image_. Defaults to CompressedImage.DEFAULT_MAX_SIZE.
            quality (int, optional): _Compression quality(0, 100)_. Defaults to DEFAULT_IMG_QUALITY.
            extract_color (bool, optional): _If True extracts color from image every time it changes_. Defaults to False.
            extract_resize (bool, optional): _Resize image when extracting color_. Defaults to False.

        """
        self.config: ImageConfig = {
            "path": path,
            "sizes": sizes,
            "extract_color": extract_color,
            "max_size": max_size,
            "quality": quality,
            "extract_resize": extract_resize,
        }

    @classmethod
    def __camel_to_pascal(cls, name: str):
        return "".join(n.title() for n in name.split("_"))

    def __set_name__(self, parent: type, name: str):

        model_name = f"{parent.__name__}{self.__camel_to_pascal(name)}"
        fields = {
            "referring": ImageOneToOneField(
                parent.__name__, on_delete=dj_models.CASCADE, related_name=name
            ),
            "CONFIG": self.config,
        }

        model = create_model(
            model_name,
            fields,
            module=parent.__module__,
            bases=(CompressedImage,),
            admin_opts=[],
        )

        CHILD_MODELS[model_name] = model
