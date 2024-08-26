from typing import Annotated
from fastapi import APIRouter, Depends

from ....deps.images import ImageCompressor, CompressedImage


router = APIRouter()

room_cover = ImageCompressor(upload_path="room-cover")


@router.post("/cover")
async def upload_room_cover(
    compressed: Annotated[
        CompressedImage,
        Depends(room_cover),
    ]
):
    return compressed
