from functools import wraps
from typing import Callable, Optional, Union, cast
from celery import shared_task as _shared_task, Task
from celery.utils.log import get_task_logger

import redis
from django.conf import settings


__all__ = ["shared_task"]

logger = get_task_logger(__name__)


redis_client = redis.Redis.from_url(settings.CELERY_BROKER_URL)

LOCK_NAMESPACE = "shared_lock_id"


def shared_task(*args, **kwargs) -> Task:
    return cast(Task, _shared_task(*args, **kwargs))


def once_shared_task(
    _func: Optional[Callable] = None,
    *,
    lock_timeout: Union[float, int] = 60,
    task_key: Optional[str] = None,
    **options
) -> Task:
    options["bind"] = True

    def decorator(run_func: Callable):

        @wraps(run_func)
        def wrapper(self: Task, *args, **kwargs):
            have_lock = False
            lock_key = ":".join(
                (LOCK_NAMESPACE, task_key or run_func.__name__, self.request.id)
            )
            lock = redis_client.lock(lock_key, timeout=lock_timeout, blocking=False)
            try:
                have_lock = lock.acquire(blocking=False)
                if have_lock:
                    run_func(*args, **kwargs)
                else:
                    logger.info("LOCK IS WORKING BRUHHHHHHHHHH")
            finally:
                if have_lock:
                    lock.release()

        return _shared_task(wrapper, **options)

    if _func:
        return cast(Task, decorator(_func))

    return cast(Task, decorator)
