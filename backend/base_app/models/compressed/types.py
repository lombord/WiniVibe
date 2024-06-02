from typing import Optional, TypedDict


ImageSize = tuple[int, int]


class ImageSizes(TypedDict):
    large: ImageSize
    medium: Optional[ImageSize]
    small: Optional[ImageSize]


class ImageConfig(TypedDict):
    path: str
    sizes: ImageSizes
    extract_color: bool
    max_size: int
    quality: int
    extract_resize: bool
