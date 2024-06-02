from django.db import models
from django.utils.translation import gettext_lazy as _

from .common import Tag
from .compressed import CompImageField


class Room(models.Model):

    name = models.CharField(_("Room name"), max_length=255)
    is_public = models.BooleanField(_("Is public room"), default=False)
    can_chat = models.BooleanField(_("Can chat"), default=True)
    description = models.TextField(_("Room description"), max_length=500)
    host = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="created_rooms"
    )
    queue_tracks = models.ManyToManyField("Track", related_name="rooms")
    cover_image = CompImageField(
        path="users/{obj.host_id}/room/",
        sizes={"large": (500, 500)},
        extract_color=True,
    )
    tags = models.ManyToManyField(Tag, related_name="rooms")

    people = models.ManyToManyField(
        "User", through="RoomMember", related_name="joint_rooms"
    )


class JoinRequest(models.Model):
    PENDING = 0
    ACCEPTED = 1
    DECLINED = 2

    STATUSES = [
        (PENDING, "Pending"),
        (ACCEPTED, "Accepted"),
        (DECLINED, "Declined"),
    ]

    user = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="my_requests"
    )
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="requests")

    status = models.SmallIntegerField(
        _("Request status"), choices=STATUSES, default=PENDING
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "room"],
                name="unique_join_request",
                violation_error_message=_("You have already requested"),
            )
        ]


class RoomMember(models.Model):

    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="members")
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="+")
    is_muted = models.BooleanField(_("Is muted member"), default=False)
    can_add_song = models.BooleanField(_("Can add song"), default=False)

    joint_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["room", "user"],
                name="join_room_once",
                violation_error_message=_("You are already a member of this room"),
            )
        ]


class RoomMessage(models.Model):

    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="messages")
    owner = models.ForeignKey("User", on_delete=models.SET_NULL, null=True)
    message = models.TextField(_("Message"))
    replied_to = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_("Replied message"),
        related_name="replies",
    )
