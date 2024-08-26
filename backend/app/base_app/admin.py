from django.contrib import admin

from django.db.models import Model
from . import models


admin.site.register(
    val
    for val in models.__dict__.values()
    if isinstance(val, type) and issubclass(val, Model)
)
