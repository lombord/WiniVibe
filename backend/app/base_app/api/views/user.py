from rest_framework import generics as GS, permissions as PM

from ...models import User

from ..serializers import UserSessionSerializer, UserSerializer


class UserSessionAPIView(GS.RetrieveAPIView):
    permission_classes = (PM.IsAuthenticated,)
    serializer_class = UserSessionSerializer

    def get_object(self):
        queryset = User.objects.fetch_session()
        return GS.get_object_or_404(queryset, pk=self.request.user.pk)


class UserProfileAPIView(GS.RetrieveUpdateAPIView):
    permission_classes = (PM.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        queryset = User.objects.fetch_profile()
        return GS.get_object_or_404(queryset, pk=self.request.user.pk)
