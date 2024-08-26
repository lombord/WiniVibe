from typing import Optional
from storages.backends.s3 import S3Storage, clean_name


class S3PathStorage(S3Storage):

    def save_from_key(self, obj_key: str, max_length: Optional[int] = None):
        cleaned_key = clean_name(obj_key)

        return cleaned_key
