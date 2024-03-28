from urllib.parse import urlparse

from django.db import models
from django.db.models import F
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


from .abstract import CompressedImage
from .fields import CompImageField


class User(AbstractUser):
    """
    App User model
    """

    email = models.EmailField(_("email address"), unique=True)
    # active sessions number
    status = models.PositiveSmallIntegerField(_("user status"), default=0, blank=True)

    followers = models.ManyToManyField(
        "self", through="UserFollow", related_name="following", symmetrical=False
    )

    queue_tracks = models.ManyToManyField(
        "Track",
        through="UserTrackQueue",
        related_name="+",
        verbose_name=_("User's tracks queue"),
    )

    USERNAME_FIELD: str = "email"
    REQUIRED_FIELDS: list[str] = ["username"]

    class Meta:
        indexes = [
            # Indexing user status to speed up sorting
            models.Index(F("status").desc(), name="user_status_idx"),
        ]


class UserTrackQueue(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    track = models.ForeignKey("Track", on_delete=models.CASCADE)


class UserProfileImage(CompressedImage):
    COMP_CONFIG = {
        "path": "users/{obj.user_id}/photo/",
        "sizes": {"large": (500, 500)},
    }


class UserHeaderImage(CompressedImage):
    COMP_CONFIG = {
        "path": "users/{obj.user_id}/header/",
        "sizes": {"large": (1500, 350), "medium": 0, "small": 0},
    }


class UserProfile(models.Model):

    photo = CompImageField(
        UserProfileImage,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        verbose_name=_("Compressed photos"),
    )

    header_image = CompImageField(
        UserHeaderImage,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        verbose_name=_("Profile header image"),
    )

    city = models.CharField(_("City"), max_length=100, null=True, blank=True)
    country = models.CharField(_("Country"), max_length=100, null=True, blank=True)
    bio = models.TextField(_("BIO"), max_length=600, null=True, blank=True)

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")


class UserSocialLink(models.Model):

    title = models.CharField(
        _("short title"), max_length=50, blank=True, default="social"
    )
    link = models.URLField(_("social link"))
    profile = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="social_links"
    )

    def save(self, *args, **kwargs):
        if not self.title:
            self.title = (urlparse(self.link).netloc)[:50] or None
        super().save(*args, **kwargs)


class UserFollow(models.Model):

    following = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="+",
        verbose_name=_("Following for"),
    )
    follower = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="+",
        verbose_name=_("Follower"),
    )
    followed_date = models.DateTimeField(_("Followed date"), auto_now_add=True)

    class Meta:
        constraints = [
            # unique followings
            models.UniqueConstraint(
                fields=["following", "follower"],
                name="follow_once",
                violation_error_message=_("You are already following this user"),
            ),
            models.CheckConstraint(
                check=~models.Q(follower=models.F("following")),
                name="dont_follow_yourself",
                violation_error_message=_("You can't follow yourself!"),
            ),
        ]
