from fastapi import APIRouter, Request

from .tags import MediaTag
from . import audios
from . import images


router = APIRouter(prefix="/upload", tags=["upload"])

router.include_router(audios.router, tags=[MediaTag.audios])
router.include_router(images.router, tags=[MediaTag.images])


@router.get("/ping")
async def pong(request: Request):
    return {"response": "pong"}
