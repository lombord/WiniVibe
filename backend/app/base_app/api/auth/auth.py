from typing import Type
from django.utils.translation import gettext_lazy as _


from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import (
    TokenError,
    InvalidToken,
    AuthenticationFailed,
)
from rest_framework_simplejwt.tokens import Token, AccessToken, RefreshToken

from .api_jwt import jwt_manager


class JWTCookieAuthentication(JWTAuthentication, SessionAuthentication):

    def validate_cookie_token(self, token_cls: Type[Token], token):
        try:
            return token_cls(token)
        except TokenError:
            raise InvalidToken(
                {
                    "detail": _("Given token not valid for any token type"),
                }
            )

    def _auth_cookie_token(self, request, token_cls, token=None):
        if not token:
            return None
        validated_token = self.validate_cookie_token(token_cls, token)
        credentials = self.get_user(validated_token), validated_token
        if credentials:
            self.enforce_csrf(request)
        return credentials

    def _try_access_auth(self, request):
        return self._auth_cookie_token(
            request, AccessToken, request.COOKIES.get(jwt_manager.access_key)
        )

    def _try_refresh_auth(self, request):
        signals = jwt_manager.get_signals(request)
        try:
            credentials = self._auth_cookie_token(
                request,
                RefreshToken,
                request.COOKIES.get(jwt_manager.refresh_key),
            )
        except InvalidToken as exc:
            signals.logout_token = True
            raise exc
        if credentials:
            signals.update_token = True

        return credentials

    def authenticate(self, request):
        credentials = None
        try:
            credentials = self._try_access_auth(request)
        except InvalidToken as exc:
            credentials = self._try_refresh_auth(request)
            if not credentials:
                raise exc
        except AuthenticationFailed as exc:
            print("Auth failed")
            signals = jwt_manager.get_signals(request)
            signals.logout_token = True
            raise exc

        if not credentials:
            credentials = self._try_refresh_auth(request)
        if not credentials:
            credentials = super().authenticate(request)

        return credentials
