import json
import re
from typing import Any, Dict
from django.conf import settings

from boto3 import Session
from mypy_boto3_s3 import S3Client

from celery.utils.log import get_task_logger


logger = get_task_logger(__name__)


FilesMeta = Dict[str, Any]


class S3Manager:

    META_FILE_NAME: str = "meta.json"
    USED_PREFIX: str = "used/"
    UNUSED_RE = re.compile(r"^unused/", re.IGNORECASE)

    __manager = None

    def __new__(cls):
        manager = cls.__manager
        if manager is None:
            manager = cls.__manager = super().__new__(cls)

        return manager

    def __init__(self):
        self.session = Session(
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )
        self.bucket = settings.AWS_STORAGE_BUCKET_NAME

    def get_client(self) -> S3Client:
        return self.session.client(
            "s3",
            endpoint_url=settings.AWS_S3_ENDPOINT_URL,
        )

    def delete_objects(self, prefix: str):
        if not prefix:
            return
        client = self.get_client()
        objects = client.list_objects_v2(Bucket=self.bucket, Prefix=prefix)
        contents = objects.get("Contents")
        if contents:
            keys = [{"Key": obj.get("Key")} for obj in contents]
            if keys:
                client.delete_objects(Bucket=self.bucket, Delete={"Objects": keys})  # type: ignore
                return True

    def get_meta_key(self, prefix: str) -> str:
        return f"{prefix}/{self.META_FILE_NAME}"

    def encode_meta(self, data: FilesMeta) -> bytes:
        return json.dumps(data).encode("utf-8")

    def decode_meta(self, body: bytes) -> FilesMeta:
        return json.loads(body.decode("utf-8"))

    def used_file_key(self, old_key: str) -> str:
        return self.UNUSED_RE.sub(self.USED_PREFIX, old_key)

    def get_metadata(self, client: S3Client, prefix: str):
        try:
            meta_key = self.get_meta_key(prefix)
            meta_obj = client.get_object(Bucket=self.bucket, Key=meta_key)
            return self.decode_meta(meta_obj.get("Body").read())
        except Exception:
            return None

    def commit_files(self, og_prefix: str):
        try:
            assert og_prefix
            client = self.get_client()
            bucket = self.bucket
            objects = client.list_objects_v2(Bucket=bucket, Prefix=og_prefix)
            contents = objects.get("Contents")
            assert contents
            for obj in contents:
                old_key = obj.get("Key")
                if old_key:
                    new_key = self.used_file_key(old_key)
                    if old_key != new_key:
                        client.copy_object(
                            Bucket=bucket,
                            CopySource={"Bucket": bucket, "Key": old_key},
                            Key=new_key,
                        )
            new_prefix = self.used_file_key(og_prefix)
            meta_data = self.get_metadata(client, new_prefix)
            return new_prefix, meta_data
        except Exception:
            return (None, None)


s3_manager = S3Manager()
