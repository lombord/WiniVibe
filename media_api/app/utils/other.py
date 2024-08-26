from collections.abc import Sequence
from datetime import datetime, timezone
from typing import TypeVar, Union


T = TypeVar("T")


def getitem(
    seq: Sequence[T], idx: int, default: Union[T, None] = None
) -> Union[T, None]:
    try:
        return seq[idx]
    except IndexError:
        return default


def json_utc_now():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
