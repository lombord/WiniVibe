from datetime import timedelta
from functools import lru_cache
import os
from typing import Annotated, List, Optional, Set, Union
import secrets
from fastapi import Depends
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    model_config = SettingsConfigDict()

    PRODUCTION: bool = False

    # # # # # # # # # #
    # AWS configuration #
    # # # # # # # # # #

    # default values are just for sample, actual values are read from .env file
    AWS_BUCKET_NAME: Optional[str] = None
    AWS_BUCKET_REGION: Optional[str] = None
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_ENDPOINT: Optional[str] = None

    S3_IMAGES_DIR: str = "images/"
    S3_CHECK_COMMIT_DELAY: float = timedelta(minutes=1).total_seconds()

    # # # # # # # # # #
    # API configuration #
    # # # # # # # # # #

    API_SECRET_KEY: str = secrets.token_hex(16)
    API_JWT_COOKIE_KEY: str = "api_access_token"
    API_CSRF_COOKIE_KEY: str = "csrftoken"
    API_CSRF_HEADER_NAME: str = "X-CSRFTOKEN"
    MEDIA_API_URN: str = "urn:media-api"
    JWT_ISSUER_URN: str = Field(
        default="urn:jwt-issuer", validation_alias="DJANGO_API_URN"
    )

    # # # # # # # # # # # # # #
    # Compression configuration #
    # # # # # # # # # # # # # #

    ### Image compression config ###
    DEFAULT_MAX_IMAGE_SIZE: int = 24 * 1024 * 1024  # 2mb
    VALID_IMAGE_FORMATS: Set[str] = {"JPEG", "PNG", "GIF"}
    DEFAULT_IMG_QUALITY: int = 85
    IMG_MODE: str = "RGB"
    IMG_FORMAT: str = "JPEG"
    IMG_EXTENSION: str = ".jpg"
    MAX_IMG_COMPRESSION: int = 10

    ### Audio files configuration ###
    VALID_AUDIO_EXTS: Set[str] = {
        "mp3",
        "mp2",
        "ogg",
        "wav",
        "flac",
        "aiff",
        "alac",
        "opus",
    }

    VALID_AUDIO_MIMES: Set[str] = {
        "audio/mpeg",
        "audio/ogg",
        "audio/wav",
        "audio/flac",
        "audio/x-aiff",
        "audio/x-m4a",
    }

    MAX_AUDIO_SIZE: float = 0.5 * 1024 * 1024 * 1024  # 0.5gb
    AUDIO_FORMAT: str = "opus"
    AUDIO_CODEC: str = "libopus"
    AUDIO_EXT: str = ".opus"
    AUDIO_BITRATE: str = "64k"

    # # # # # # # # # # # #
    # Celery configuration  #
    # # # # # # # # # # # #

    CELERY_BROKER_URL: str = (
        f"redis://{os.getenv('REDIS_HOST', 'localhost')}:{os.getenv('REDIS_PORT', 6379)}/0"
    )
    CELERY_ACCEPT_CONTENT: Union[str, List[str]] = ["json"]
    CELERY_TASK_SERIALIZER: str = "json"
    CELERY_TASK_DEFAULT_QUEUE: str = "media-api-queue"
    CELERY_TASK_DEFAULT_ROUTING_KEY: str = "media-api-route"


settings = Settings()


@lru_cache()
def get_settings():
    return settings


SettingsDep = Annotated[Settings, Depends(get_settings)]
