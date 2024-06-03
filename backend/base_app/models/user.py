from urllib.parse import urlparse

from django.db import models
from django.db.models import F, Count, Subquery, OuterRef
from django.contrib.auth.models import AbstractUser, UserManager as DJUserManager
from django.utils.translation import gettext_lazy as _


from .compressed import CompImageField
from .fields import AutoOneToOneField


class UserQuerySet(models.QuerySet):

    def annotate_followers(self):
        followers_qs = Subquery(
            UserFollow.objects.filter(following=OuterRef("pk"))
            .values("following__pk")
            .annotate(f_count=Count("pk"))
            .values("f_count")
        )
        following_qs = Subquery(
            UserFollow.objects.filter(follower=OuterRef("pk"))
            .values("follower__pk")
            .annotate(f_count=Count("pk"))
            .values("f_count")
        )
        return self.annotate(
            _followers_count=followers_qs,
            _following_count=following_qs,
        )

    def select_profile(self):
        return self.select_related("profile", "profile__header_image", "profile__photo")

    def select_photo(self):
        return self.select_related("profile", "profile__photo")


class UserManager(DJUserManager):

    def get_queryset(self) -> UserQuerySet:
        return UserQuerySet(self.model, using=self._db)

    def fetch_public(self) -> UserQuerySet:
        return (
            self.get_queryset()
            .select_photo()
            .only("id", "username", "profile", "profile__photo")
        )

    def fetch_profile(self) -> UserQuerySet:
        return self.get_queryset().annotate_followers().select_profile()


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

    objects: UserManager = UserManager()

    class Meta:
        indexes = [
            # Indexing user status to speed up sorting
            models.Index(F("status").desc(), name="user_status_idx"),
        ]

    @property
    def followers_count(self):
        return getattr(self, "_followers_count", 0) or 0

    @property
    def following_count(self):
        return getattr(self, "_following_count", 0) or 0


class UserTrackQueue(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    track = models.ForeignKey("Track", on_delete=models.CASCADE)


class UserProfile(models.Model):

    photo = CompImageField(
        path="users/{obj.user_id}/photo/",
        sizes={"large": (500, 500)},
        extract_color=True,
    )

    header_image = CompImageField(
        path="users/{obj.user_id}/header/",
        sizes={"large": (1400, 350), "small": 0},
        extract_color=True,
        extract_resize=True,
    )

    city = models.CharField(_("City"), max_length=100, null=True, blank=True)
    country = models.CharField(_("Country"), max_length=100, null=True, blank=True)
    bio = models.TextField(_("BIO"), max_length=600, null=True, blank=True)

    user = AutoOneToOneField(User, on_delete=models.CASCADE, related_name="profile")


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
