from typing import Annotated
from fastapi import APIRouter, Depends

from ....deps.images import ImageCompressor, CompressedImage


router = APIRouter()

playlist_cover = ImageCompressor(upload_path="playlist-cover")


@router.post("/cover")
async def upload_playlist_cover(
    compressed: Annotated[
        CompressedImage,
        Depends(playlist_cover),
    ]
):
    return compressed
