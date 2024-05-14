from django.conf import settings
from django.http import HttpRequest
from django.middleware import csrf
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.signals import user_logged_in

from knox.models import AuthToken


from rest_framework.response import Response
from rest_framework import permissions as PM, generics as GS
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import (
    LoginView as KnoxLoginView,
    LogoutView as KnoxLogoutView,
    LogoutAllView as KnoxLogoutAllView,
)

from ..serializers import UserSessionSerializer, UserRegisterSerializer
from ..auth import TokenAuthentication
from ..permissions import UserNotAuthenticated

knox_settings = settings.REST_KNOX


def set_token_cookie(response: Response, token: str):
    response.set_cookie(
        key=knox_settings["AUTH_COOKIE_KEY"],
        value=token,
        expires=knox_settings["TOKEN_TTL"],
        path=knox_settings["AUTH_COOKIE_PATH"],
        domain=settings.SESSION_COOKIE_DOMAIN,
        secure=settings.SESSION_COOKIE_SECURE,
        httponly=knox_settings["AUTH_COOKIE_HTTP_ONLY"],
        samesite=knox_settings["AUTH_COOKIE_SAMESITE"],
    )


def clear_token_cookie(response: Response):
    response.delete_cookie(
        key=knox_settings["AUTH_COOKIE_KEY"],
        path=knox_settings["AUTH_COOKIE_PATH"],
        domain=settings.SESSION_COOKIE_DOMAIN,
    )


class LoginView(KnoxLoginView):
    permission_classes = (PM.AllowAny,)
    serializer_class = AuthTokenSerializer

    def post(self, request: HttpRequest, format=None):
        if not request.user.is_authenticated:
            serializer = AuthTokenSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            request.user = serializer.validated_data["user"]
        response = super(LoginView, self).post(request)
        token = response.data.pop("token", None)
        set_token_cookie(response, token)
        csrf.get_token(request)
        response.data = UserSessionSerializer(instance=request.user).data
        return response


class LogoutMixin:
    authentication_classes = (TokenAuthentication,)

    def post(self, request, format=None):
        response = super().post(request)
        clear_token_cookie(response)

        return response


class LogoutView(LogoutMixin, KnoxLogoutView):
    pass


class LogoutAllView(LogoutMixin, KnoxLogoutAllView):
    pass


class UserRegisterAPIView(GS.CreateAPIView):
    permission_classes = [UserNotAuthenticated]
    serializer_class = UserRegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        self.request.user = user
        print(user.pk)
        return user

    def get_token_ttl(self):
        return knox_settings.TOKEN_TTL

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        instance, token = AuthToken.objects.create(
            request.user, knox_settings["TOKEN_TTL"]
        )
        user_logged_in.send(
            sender=request.user.__class__, request=request, user=request.user
        )
        set_token_cookie(response, token)
        csrf.get_token(request)
        return response
