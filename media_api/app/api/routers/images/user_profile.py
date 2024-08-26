from typing import Annotated
from fastapi import APIRouter, Depends

from ....deps.images import ImageCompressor, CompressedImage


router = APIRouter()

upload_prefix = "user/"

profile_photo = ImageCompressor(upload_path=f"{upload_prefix}photo")
profile_banner = ImageCompressor(
    upload_path=f"{upload_prefix}banner",
    sizes={
        "large": (1550, 375),
        "medium": (800, 200),
        "small": None,
    },
    resize_on_extract=True,
)


@router.post("/photo")
async def upload_photo(
    compressed: Annotated[
        CompressedImage,
        Depends(profile_photo),
    ]
):
    return compressed


@router.post("/banner")
async def upload_banner(
    compressed: Annotated[
        CompressedImage,
        Depends(profile_banner),
    ]
):
    return compressed
