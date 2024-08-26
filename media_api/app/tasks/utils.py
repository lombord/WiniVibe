import asyncio
from functools import wraps
from typing import cast
from celery import shared_task as _shared_task, Task

__all__ = ["shared_task"]


def shared_task(*args, **kwargs) -> Task:
    return cast(Task, _shared_task(*args, **kwargs))


def async_shared_task(_func=None, **options) -> Task:

    def decorator(func):

        @wraps(func)
        def wrapper(*args, **kwargs):
            loop = asyncio.get_event_loop()
            return loop.run_until_complete(func(*args, **kwargs))

        return _shared_task(wrapper, **options)

    if _func:
        return cast(Task, decorator(_func))

    return cast(Task, decorator)
