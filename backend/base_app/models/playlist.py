from django.db import models

from django.utils.translation import gettext_lazy as _

from .common import Tag
from .abstract import CompImageField


class Playlist(models.Model):

    title = models.CharField(_("Playlist title"), max_length=255)
    description = models.TextField(_("Playlist description"), max_length=500)
    owner = models.ForeignKey(
        "User", on_delete=models.CASCADE, verbose_name=_("Playlist owner")
    )
    is_public = models.BooleanField(_("Is public playlist?"), default=False)
    tags = models.ManyToManyField(Tag, related_name="playlists")
    cover_image = CompImageField(
        {
            "path": "users/{obj.owner_id}/playlist/",
            "sizes": {"large": (500, 500)},
        }
    )
    liked_people = models.ManyToManyField(
        "User", through="PlaylistLike", related_name="liked_playlists"
    )


class PlaylistLike(models.Model):

    user = models.ForeignKey(
        "User", on_delete=models.SET_NULL, null=True, related_name="+"
    )
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name="+")

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "playlist"],
                name="unique_playlist_like",
                violation_error_message=_("You have already liked this playlist"),
            )
        ]


class PlaylistTrack(models.Model):

    playlist = models.ForeignKey(
        Playlist, on_delete=models.CASCADE, related_name="tracks"
    )
    track = models.ForeignKey("Track", on_delete=models.CASCADE, related_name="+")
    added = models.DateTimeField(_("Added date"), auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["playlist", "track"],
                name="unique_playlist_track",
                violation_error_message=_(
                    "This track has already been added to the playlist"
                ),
            )
        ]
