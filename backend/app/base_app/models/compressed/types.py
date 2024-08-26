from typing import Optional, TypedDict


ImageSize = tuple[int, int]


class ImageSizes(TypedDict):
    large: ImageSize
    medium: Optional[ImageSize]
    small: Optional[ImageSize]


class ImageConfig(TypedDict):
    upload_key_path: str
