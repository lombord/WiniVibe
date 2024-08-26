from django.http import HttpRequest
from .api_jwt import jwt_manager


class JWTCookieMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest):
        signals = jwt_manager.setup_signals(request)
        response = self.get_response(request)

        if signals.update_token:
            jwt_manager.update_token(response, request.user)
        elif signals.logout_token:
            jwt_manager.logout_token(response)

        return response
