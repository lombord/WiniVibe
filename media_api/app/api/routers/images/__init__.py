from fastapi import APIRouter
from . import user_profile, playlists, rooms, tracks


from .config import ImageTag

router = APIRouter()

router.include_router(
    user_profile.router, prefix="/user-profile", tags=[ImageTag.profile]
)
router.include_router(playlists.router, prefix="/playlist", tags=[ImageTag.playlists])
router.include_router(tracks.router, prefix="/track", tags=[ImageTag.tracks])
router.include_router(rooms.router, prefix="/room", tags=[ImageTag.rooms])
