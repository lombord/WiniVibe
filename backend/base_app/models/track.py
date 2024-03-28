from pydub import AudioSegment
from pathlib import Path

from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
from django.core.files import File

from .utils import DynamicPath, FileValidator
from .abstract import CommentBase, CompressedImage
from .fields import CompImageField
from .constants import (
    VALID_AUDIO_EXTS,
    VALID_AUDIO_MIMES,
    MAX_AUDIO_SIZE,
    AUDIO_FORMAT,
    AUDIO_CODEC,
    AUDIO_BITRATE,
    AUDIO_EXT,
)

validate_audio_ext = FileExtensionValidator(
    VALID_AUDIO_EXTS,
    _("Invalid audio format valid formats are: %s") % ", ".join(VALID_AUDIO_EXTS),
)

validate_audio_file = FileValidator(
    max_size=MAX_AUDIO_SIZE, content_types=VALID_AUDIO_MIMES
)


class TrackCoverImage(CompressedImage):
    COMP_CONFIG = {
        "path": "users/{obj.uploaded_by_id}/tracks/images/",
        "sizes": {"large": (500, 500)},
    }


class Track(models.Model):

    title = models.CharField(_("Track title"), max_length=100)
    slug = models.CharField(_("Track slug"), max_length=255, blank=True)
    uploaded_by = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
        verbose_name=_("Uploaded user"),
        related_name="tracks",
    )
    tags = models.ManyToManyField("Tag", related_name="tracks")
    description = models.TextField(
        _("Track description"), max_length=1e3, blank=True, null=True
    )
    is_public = models.BooleanField(_("Is public track"), default=True, blank=True)
    cover_image = CompImageField(
        TrackCoverImage,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        verbose_name=_("Track cover image"),
    )
    track = models.FileField(
        _("Track file"),
        upload_to=DynamicPath(
            "users/{track.uploaded_by_id}/tracks/{track.pk}", "track", ext=AUDIO_EXT
        ),
        max_length=255,
        validators=[validate_audio_file, validate_audio_ext],
    )
    metadata = models.JSONField(_("Track metadata"), blank=True, default=dict)

    liked_people = models.ManyToManyField(
        "User", related_name="liked_tracks", through="TrackLike"
    )

    streamed_people = models.ManyToManyField(
        to="User", through="TrackStream", related_name="streamed_tracks"
    )

    playlists = models.ManyToManyField(
        "Playlist", through="PlaylistTrack", related_name="+"
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__old_track = self.track

    def clean(self) -> None:

        if self.track != self.__old_track:
            self.clear_old_track()

            try:
                sound: AudioSegment = AudioSegment.from_file(self.track)
                self.metadata = {"duration": sound.duration_seconds}
                file = File(
                    sound.export(
                        format=AUDIO_FORMAT, codec=AUDIO_CODEC, bitrate=AUDIO_BITRATE
                    )
                )
                self.metadata["size"] = file.size
                self.track = file
            except Exception:
                raise ValidationError(_("Invalid audio file"), "invalid")

    def clear_old_track(self):
        if self.__old_track:
            Path(self.__old_track.path).unlink(True)


class TrackLike(models.Model):

    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name="+")
    user = models.ForeignKey(
        "User", on_delete=models.SET_NULL, null=True, related_name="+"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["track", "user"],
                name="unique_track_like",
                violation_error_message=_("You have already liked this track!"),
            )
        ]


class TrackStream(models.Model):

    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name="streams")
    user = models.ForeignKey(
        "User", on_delete=models.SET_NULL, null=True, related_name="streams"
    )
    play_count = models.IntegerField(_("Play count"), default=1, blank=True)
    timestamp = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["track", "user"],
                name="unique_track_stream",
                violation_error_message=_("Track stream relation must be unique"),
            )
        ]


class TrackComment(CommentBase):

    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name="comments")
    owner = models.ForeignKey(
        "User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="track_comments",
        verbose_name=_("Comment owner"),
    )

    liked_people = models.ManyToManyField(
        "User", through="TrackCommentLike", related_name="liked_comments"
    )


class TrackCommentLike(models.Model):
    user = models.ForeignKey(
        "User", on_delete=models.SET_NULL, null=True, related_name="+"
    )
    comment = models.ForeignKey(
        TrackComment, on_delete=models.CASCADE, related_name="+"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "comment"],
                name="unique_track_comment_like",
                violation_error_message=_("You have already liked this comment"),
            )
        ]


class TrackCommentReply(CommentBase):
    comment = models.ForeignKey(
        TrackComment, on_delete=models.CASCADE, related_name="replies"
    )

    replied_to = models.ForeignKey(
        "User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="received_replies",
    )

    liked_people = models.ManyToManyField(
        "User", through="TrackReplyLike", related_name="liked_replies"
    )


class TrackReplyLike(models.Model):

    user = models.ForeignKey(
        "User", on_delete=models.SET_NULL, null=True, related_name="+"
    )
    comment = models.ForeignKey(
        TrackCommentReply, on_delete=models.CASCADE, related_name="+"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "comment"],
                name="unique_comment_reply_like",
                violation_error_message=_("You have already liked this comment"),
            )
        ]
