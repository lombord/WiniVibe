from rest_framework import routers

from .user import UserModelViewSet
from .track import TrackModelViewSet

router = routers.SimpleRouter()
router.register("users", UserModelViewSet, basename="user")
router.register("tracks", TrackModelViewSet, basename="track")

urls = router.urls
