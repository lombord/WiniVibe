from tempfile import _TemporaryFileWrapper
from typing import Dict, Iterable, List, Tuple, TypedDict, TypeAlias
from typing_extensions import NotRequired, Optional
from PIL.Image import Image


ImageWidth: TypeAlias = int
ImageHight: TypeAlias = int


ImageSize = Tuple[ImageWidth, ImageHight]


class ImageSizes(TypedDict):
    large: ImageSize
    medium: NotRequired[Optional[ImageSize]]
    small: NotRequired[Optional[ImageSize]]


class ImageSizesCleaned(TypedDict):
    large: ImageSize
    medium: ImageSize
    small: ImageSize


ImageSizesItems = Iterable[Tuple[str, ImageSize]]

ResizedImages = Dict[str, Image]

NamedImageFile = _TemporaryFileWrapper

UploadImages = List[Tuple[str, str]]
