from rest_framework import viewsets
from rest_framework.decorators import action


from ..serializers import UserProfileSerializer, PublicUserSerializer
from ...models import User

from .nested import NestedViewSetMixin, nested_action


class UserFollowersMixin:
    @action(detail=True, methods=["get"])
    @nested_action
    def followers(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def followers_ser_class(self):
        return PublicUserSerializer

    def followers_queryset(self):
        return self.root_user.followers.fetch_public()


class UserFollowingMixin:
    @action(detail=True, methods=["get"])
    @nested_action
    def following(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def following_ser_class(self):
        return PublicUserSerializer

    def following_queryset(self):
        return self.root_user.following.fetch_public()


class UserModelViewSet(
    UserFollowersMixin,
    UserFollowingMixin,
    NestedViewSetMixin,
    viewsets.ReadOnlyModelViewSet,
):
    lookup_url_kwarg = "username"
    lookup_field = "username"

    root_obj_name = "root_user"

    def root_queryset(self):
        if self.action == "retrieve":
            return User.objects.fetch_profile()
        return User.objects.fetch_public()

    def root_ser_class(self):
        if self.action == "retrieve":
            return UserProfileSerializer
        return PublicUserSerializer

    def queryset_for_nested(self):
        return User.objects.only("pk")
