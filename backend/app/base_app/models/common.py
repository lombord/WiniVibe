from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify


class Tag(models.Model):
    name = models.CharField(_("Tag Name"), max_length=255, unique=True)
    slug = models.SlugField(_("Tag Slug"), max_length=255, unique=True, blank=True)
    tag_type = models.CharField(_("Tag Type"), max_length=50, blank=True, default="tag")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"#{self.name}"
