import asyncio
import json
import secrets
from typing import Any, Coroutine, Dict, List, Optional, TypeVar
import aioboto3

from types_aiobotocore_s3 import S3Client

from ..utils.other import json_utc_now

from ..core.config import settings

T = TypeVar("T")
K = TypeVar("K", str, int)

UploadObjectsBase = Dict[str, T]

UploadObjects = UploadObjectsBase[bytes]

UploadFiles = UploadObjectsBase[str]

ObjectKeys = Dict[str, str]

UploadMeta = Dict[str, Any]


class S3Manager:

    META_FILE_NAME: str = "meta.json"
    UNUSED_PREFIX: str = "unused/"

    __manager_instance = None
    _client = None

    def __new__(cls):
        if not cls.__manager_instance:
            cls.__manager_instance = super().__new__(cls)
        return cls.__manager_instance

    def __init__(self) -> None:
        self.session: aioboto3.Session = aioboto3.Session(
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_BUCKET_REGION,
        )
        self.bucket = settings.AWS_BUCKET_NAME or ""

    @property
    def client(self) -> S3Client:
        return self.session.client(
            "s3",
            endpoint_url=settings.AWS_ENDPOINT,
        )

    def get_objects_dir(self, dir_prefix: str = ""):
        dir_key = secrets.token_hex(20)
        return dir_key, f"{self.UNUSED_PREFIX}{dir_prefix.strip('/')}/{dir_key}"

    async def upload_object(self, key: str, file):
        async with self.client as s3:
            await s3.put_object(
                Bucket=self.bucket,
                Key=key,
                Body=file,
            )

    def get_meta_key(self, prefix: str) -> str:
        return f"{prefix}/{self.META_FILE_NAME}"

    def encode_meta(self, data: UploadMeta) -> bytes:
        return json.dumps(data).encode("utf-8")

    def decode_meta(self, body: bytes) -> Optional[UploadMeta]:
        if body:
            return json.loads(body.decode("utf-8"))

    def get_base_metadata(self):
        return {"created": json_utc_now()}

    async def upload_files(
        self,
        files: UploadFiles,
        dir_prefix: str = "",
        extra_meta: Optional[UploadMeta] = None,
    ):

        async with self.client as s3:
            bucket = self.bucket
            dir_token, files_dir = self.get_objects_dir(dir_prefix)

            coroutines: List[Coroutine] = [
                s3.upload_file(fname, bucket, f"{files_dir}/{key}")
                for key, fname in files.items()
            ]

            meta_data = self.get_base_metadata()
            if extra_meta:
                meta_data.update(extra_meta)

            coroutines.append(
                s3.put_object(
                    Bucket=bucket,
                    Key=self.get_meta_key(files_dir),
                    Body=self.encode_meta(meta_data),
                )
            )

            await asyncio.gather(*coroutines)
            return dir_token

    async def upload_images(
        self,
        files: UploadFiles,
        dir_prefix: str = "",
        extracted_color: Optional[str] = None,
    ):
        return await self.upload_files(
            files,
            dir_prefix,
            {"extracted_color": extracted_color},
        )

    async def delete_object(self, key: str):
        async with self.client as s3:
            await s3.delete_object(
                Bucket=self.bucket,
                Key=key,
            )

    async def delete_directory(self, dir: str):
        async with self.client as s3:
            dir_objects = await s3.list_objects_v2(Bucket=self.bucket, Prefix=dir)
            delete_objs = [
                {"Key": obj.get("Key")} for obj in dir_objects.get("Contents", [])
            ]
            if delete_objs:
                await s3.delete_objects(
                    Bucket=self.bucket, Delete={"Objects": delete_objs}  # type: ignore
                )


s3_manager = S3Manager()
