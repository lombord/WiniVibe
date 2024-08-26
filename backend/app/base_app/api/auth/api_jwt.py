from dataclasses import dataclass
from datetime import timedelta
from typing import Any, Dict, Optional, Union

from django.conf import settings
from django.http import HttpRequest
from django.middleware import csrf

from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework_simplejwt.tokens import RefreshToken

from .utils import ManagerBase


jwt_config = settings.SIMPLE_JWT


@dataclass(slots=True)
class JWTSignals:
    update_token: bool = False
    logout_token: bool = False


class ApiJWTManager(ManagerBase):

    token_class = RefreshToken
    signal_obj_attr: str = "_jwt_signal_obj"

    def __init__(
        self,
        *,
        auth_cookie_access_key: str,
        auth_cookie_refresh_key: str,
        access_token_lifetime: timedelta,
        refresh_token_lifetime: timedelta,
        auth_cookie_path: Optional[str] = None,
        auth_cookie_domain: Optional[str] = None,
        auth_cookie_secure: bool = False,
        auth_cookie_http_only: bool = False,
        auth_cookie_samesite: Optional[str] = None,
        **kwargs
    ) -> None:

        self.access_key = auth_cookie_access_key
        self.refresh_key = auth_cookie_refresh_key
        self.access_lifetime = access_token_lifetime
        self.refresh_lifetime = refresh_token_lifetime
        self.cookie_path = auth_cookie_path or "/"
        self.cookie_domain = auth_cookie_domain
        self.cookie_secure = auth_cookie_secure
        self.cookie_http = auth_cookie_http_only
        self.cookie_samesite = auth_cookie_samesite

    def set_cookie_base(self, response: Response, key: str, value: str, max_age=None):
        response.set_cookie(
            key=key,
            value=value,
            max_age=max_age,
            path=self.cookie_path,
            domain=self.cookie_domain,
            secure=self.cookie_secure,
            httponly=self.cookie_http,
            samesite=self.cookie_samesite,  # type: ignore
        )

    def set_access_cookie(self, response: Response, token: str):
        self.set_cookie_base(
            response,
            key=self.access_key,
            value=token,
            max_age=self.access_lifetime,
        )

    def set_refresh_cookie(self, response: Response, token: str):
        self.set_cookie_base(
            response,
            key=self.refresh_key,
            value=token,
            max_age=self.refresh_lifetime,
        )

    def set_tokens(self, response: Response, data: Dict[str, Any]):
        self.set_access_cookie(response, data["access"])
        self.set_refresh_cookie(response, data["refresh"])

    def clear_cookie_base(self, response: Response, key: str):
        response.delete_cookie(
            key=key,
            path=self.cookie_path,
            domain=self.cookie_domain,
        )

    def clear_access_cookie(self, response: Response):
        self.clear_cookie_base(response, key=self.access_key)

    def clear_refresh_cookie(self, response: Response):
        self.clear_cookie_base(response, key=self.refresh_key)

    def clear_cookies(self, response: Response):
        self.clear_access_cookie(response)
        self.clear_refresh_cookie(response)

    def logout_token(self, response: Response):
        self.clear_cookies(response)

    def update_token(self, response: Response, user):
        print("Token has been updated")
        token: RefreshToken = self.token_class.for_user(user)  # type: ignore
        self.set_access_cookie(response, str(token.access_token))
        self.set_refresh_cookie(response, str(token))

    def login_token(self, request: HttpRequest, response: Response, user):
        self.update_token(response, user)
        csrf.get_token(request)

    def setup_signals(self, request: HttpRequest) -> JWTSignals:
        signals = JWTSignals()
        setattr(request, jwt_manager.signal_obj_attr, signals)
        return signals

    def get_signals(self, request: Union[HttpRequest, Request]) -> JWTSignals:
        return getattr(request, self.signal_obj_attr)


jwt_manager: ApiJWTManager = ApiJWTManager(
    **{key.lower(): val for key, val in jwt_config.items()}
)
