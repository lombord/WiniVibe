from rest_framework import viewsets

from ..serializers import UserSerializer
from ...models import User


class UserModelViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_url_kwarg = "username"
    lookup_field = "username"
