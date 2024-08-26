from typing import Annotated
from fastapi import APIRouter, Depends

from ....deps.images import ImageCompressor, CompressedImage


router = APIRouter()

track_cover = ImageCompressor(upload_path="track-cover")


@router.post("/cover")
async def upload_track_cover(
    compressed: Annotated[
        CompressedImage,
        Depends(track_cover),
    ]
):
    return compressed
