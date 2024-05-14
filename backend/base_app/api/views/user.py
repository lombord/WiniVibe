from rest_framework import generics as GS, permissions as PM

from ..serializers import  UserSessionSerializer

from .mixins import SessionMixin


class UserSessionAPIView(SessionMixin, GS.RetrieveAPIView):
    permission_classes = (PM.IsAuthenticated,)
    serializer_class = UserSessionSerializer


class UserProfileAPIView(SessionMixin, GS.RetrieveUpdateAPIView):
    pass
