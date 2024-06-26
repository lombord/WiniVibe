# Model configurations

### Image compression config ###
DEFAULT_IMG_QUALITY = 80
IMG_MODE = "RGB"
IMG_FORMAT = "JPEG"
IMG_EXTENSION = ".jpg"
###############################################


### Audio files configuration ###
VALID_AUDIO_EXTS = {"mp3", "mp2", "ogg", "wav", "flac", "aiff", "alac", "opus"}

VALID_AUDIO_MIMES = {
    "audio/mpeg",
    "audio/ogg",
    "audio/wav",
    "audio/flac",
    "audio/x-aiff",
    "audio/x-m4a",
}
# compression configuration
MAX_AUDIO_SIZE = 1024 * 1024 * 1024
AUDIO_FORMAT = "opus"
AUDIO_CODEC = "libopus"
AUDIO_EXT = ".opus"
AUDIO_BITRATE = "64k"

###############################################
