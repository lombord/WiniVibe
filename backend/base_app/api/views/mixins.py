from rest_framework.permissions import IsAuthenticated

from ..serializers import UserSerializer


class SerializerExtraArgs:
    serializer_kwargs = {}

    def get_serializer_kwargs(self) -> dict[str]:
        return self.serializer_kwargs

    def get_serializer(self, *args, **kwargs):
        kwargs.update(self.get_serializer_kwargs())
        return super().get_serializer(*args, **kwargs)


class SessionMixin:
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
