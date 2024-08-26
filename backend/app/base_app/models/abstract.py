from django.db import models
from django.utils.translation import gettext_lazy as _


class CommentBase(models.Model):

    content = models.TextField(_("Comment content"))
    created = models.DateTimeField(_("Created date"), auto_now_add=True)
    edited = models.DateTimeField(_("Created date"), auto_now=True)

    class Meta:
        abstract = True
