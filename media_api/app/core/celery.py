from celery import Celery
from .config import settings
from .. import tasks

app = Celery("media_api")

app.config_from_object(settings, namespace="CELERY")
