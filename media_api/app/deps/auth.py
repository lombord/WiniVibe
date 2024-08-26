import re
from typing import Any, ClassVar, Dict, Literal, Union
from dataclasses import dataclass

import jwt
from pydantic import BaseModel
from fastapi import HTTPException
from starlette.requests import Request

from ..core.config import settings


class JWTAccess(BaseModel):
    token_type: Literal["access"]
    exp: int
    iat: int
    jti: str
    user_id: Union[str, int]


TokenType = Union[str, bytes]


@dataclass
class JWTAuthentication:
    csrf_cookie_len: ClassVar[int] = 32
    csrf_invalid_regex: ClassVar[re.Pattern[str]] = re.compile(r"[^a-zA-Z0-9]")

    jwt_cookie_key: str = settings.API_JWT_COOKIE_KEY
    csrf_cookie_key: str = settings.API_CSRF_COOKIE_KEY
    csrf_header_name: str = settings.API_CSRF_HEADER_NAME
    signing_key: str = settings.API_SECRET_KEY
    issuer: str = settings.JWT_ISSUER_URN
    audience: str = settings.MEDIA_API_URN

    def __hash__(self):
        return id(self)

    def __eq__(self, other):
        return id(self) == id(other)

    def verify(self, payload: Dict[str, Any]):
        return JWTAccess.model_validate(payload)

    def validate_token(self, request: Request) -> JWTAccess:
        try:
            token = request.cookies[self.jwt_cookie_key]
            payload = jwt.decode(
                token,
                key=settings.API_SECRET_KEY,
                algorithms=["HS256"],
                audience=self.audience,
                issuer=self.issuer,
            )
            verified = self.verify(payload)
            return verified
        except Exception:
            raise HTTPException(
                status_code=401,
                detail={
                    "message": "Invalid token",
                    "code": "invalid_token",
                },
            )

    def valid_csrf_format(self, token: str) -> bool:
        return bool(
            token
            and len(token) == self.csrf_cookie_len
            and not self.csrf_invalid_regex.search(token)
        )

    def validate_csrf(self, request: Request):
        try:
            csrf_cookie = request.cookies[self.csrf_cookie_key]
            csrf_header = request.headers[self.csrf_header_name]
            assert self.valid_csrf_format(csrf_cookie), "Invalid csrf token format"
            assert (
                csrf_cookie == csrf_header
            ), "CSRF cookie and CSRF header must be equal"
        except Exception as e:
            print(repr(e))
            raise HTTPException(
                status_code=401,
                detail={
                    "message": "Invalid csrf",
                    "code": "invalid_csrf",
                },
            )

    async def __call__(
        self,
        request: Request,
    ):
        self.validate_token(request)
        if request.method not in ("GET", "HEAD", "OPTIONS", "TRACE"):
            self.validate_csrf(request)


verify_token = JWTAuthentication()
