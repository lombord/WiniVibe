from knox.auth import TokenAuthentication as KnoxTokenAuthentication
from django.conf import settings

from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import AuthenticationFailed


class TokenAuthentication(KnoxTokenAuthentication, SessionAuthentication):

    def authenticate(self, request):
        print("BRO IS BEING LOGGED")
        token_config = settings.REST_KNOX
        token = request.COOKIES.get(token_config["AUTH_COOKIE_KEY"])
        if token:
            prefix = token_config["AUTH_HEADER_PREFIX"]
            request.META["HTTP_AUTHORIZATION"] = f"{prefix} {token}"
        try:
            response = super().authenticate(request)
        except AuthenticationFailed:
            return None
        if response:
            self.enforce_csrf(request)
        return response
