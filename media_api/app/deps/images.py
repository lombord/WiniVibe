import asyncio
import logging
from os import path
from pathlib import Path

import shutil
from tempfile import NamedTemporaryFile, TemporaryDirectory
from typing import Annotated, Generator, Optional, cast, Union
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor


from contextlib import contextmanager
from fastapi import BackgroundTasks, File, HTTPException, UploadFile
from PIL import Image


from ..core.config import SettingsDep, Settings, settings as gb_settings
from ..utils.colors import dominant_color
from ..models import CompressedImage
from ..s3 import s3_manager


from .types import (
    ImageSizes,
    ImageSize,
    ImageSizesCleaned,
    NamedImageFile,
    ResizedImages,
    UploadImages,
)
from .utils import resize_images


CompressQuality = Union[int, float, None]

logger = logging.getLogger("uvicorn.error")

ThumbnailSize = (500, 500)


class ImageCompressor:
    """Image compressor dependency creator class"""

    ### Base Class variables ###

    # base images directory
    base_dir: str = gb_settings.S3_IMAGES_DIR
    # processes pool for CPU bound tasks
    process_pool: ProcessPoolExecutor = ProcessPoolExecutor()
    # threads pool for I/O bound tasks
    thread_pool: ThreadPoolExecutor = ThreadPoolExecutor()
    semaphore: asyncio.Semaphore = asyncio.Semaphore(gb_settings.MAX_IMG_COMPRESSION)

    _temp_dir_prefix: str = "temp-resized-images"
    upload_temp_dir: TemporaryDirectory[str] = TemporaryDirectory(
        prefix="winivibe-uploaded-images", ignore_cleanup_errors=True
    )

    def __init__(
        self,
        upload_path: str,
        sizes: Union[ImageSizes, ImageSize] = ThumbnailSize,
        extract_color: bool = True,
        resize_on_extract: bool = False,
        max_size: int = gb_settings.DEFAULT_MAX_IMAGE_SIZE,
        quality: CompressQuality = gb_settings.DEFAULT_IMG_QUALITY,
    ):
        """Creates image compressor dependency

        Args:
            upload_path (str): _Upload path to store compressed images_
            sizes (ImageSizes): _Sizes configuration for compression_
            extract_color (bool, optional): _Whether to extract the dominant color from image_. Defaults to True.
            resize_on_extract (bool, optional): _Whether to resize a compressed image before calculating the dominant color_. Defaults to False.
            max_size (int, optional): _Max file size constraint for uploaded image_. Defaults to gb_settings.DEFAULT_MAX_IMAGE_SIZE.
            quality (CompressQuality, optional): _compression quality for PIL, can be integer between (0, 100]_. Defaults to gb_settings.DEFAULT_IMG_QUALITY.
        """

        self.sizes = sizes if isinstance(sizes, dict) else {"large": sizes}
        self.upload_path = upload_path
        self.extract_color = extract_color
        self.resize_on_extract = resize_on_extract
        self.max_size = max_size
        self.quality = quality

    @property
    def save_dir(self):
        return f"{self.base_dir}{self.upload_path}"

    @property
    def sizes(self) -> ImageSizesCleaned:
        return self.__sizes

    @sizes.setter
    def sizes(self, sizes: ImageSizes):
        large_w, large_h = sizes["large"]
        sizes.setdefault("medium", (large_w // 2, large_h // 2))
        sizes.setdefault("small", (large_w // 4, large_h // 4))
        self.__sizes = cast(ImageSizesCleaned, sizes)

    @classmethod
    def _on_shutdown(cls):
        cls.process_pool.shutdown()
        cls.thread_pool.shutdown()
        cls.upload_temp_dir.cleanup()

    def validate_image(
        self,
        settings: Settings,
        image: UploadFile,
    ):
        image_file = image.file
        try:

            # verify image size
            image_size = image.size
            assert image_size and image_size <= self.max_size, (
                "Invalid image size. Image size must be less than or equal to %s"
                % self.max_size
            )

            # verify image type
            pil_image = Image.open(image_file)
            pil_image.verify()

            # verify image format
            img_format = pil_image.format
            assert (
                img_format and img_format in settings.VALID_IMAGE_FORMATS
            ), "Invalid image format. Valid image formats are %s" % ", ".join(
                settings.VALID_IMAGE_FORMATS
            )
            image_file.seek(0)
        except AssertionError as msg:
            image_file.close()
            raise HTTPException(status_code=400, detail=str(msg))
        except Exception as e:
            print(e)
            image_file.close()
            raise HTTPException(status_code=400, detail="Invalid image")

    def _get_temp_resized(self, settings: Settings, resized_images: ResizedImages):
        upload_images: UploadImages = []
        img_format = settings.IMG_FORMAT
        quality = self.quality
        img_extension = settings.IMG_EXTENSION
        temp_dir = TemporaryDirectory(
            prefix=self._temp_dir_prefix,
            ignore_cleanup_errors=True,
            dir=self.upload_temp_dir.name,
        )
        for key, resized in resized_images.items():
            fpath = path.join(temp_dir.name, key)
            with open(fpath, "w+b") as file:
                resized.save(file, img_format, quality=quality, optimize=True)
                upload_images.append((f"{key}{img_extension}", file.name))
        return temp_dir, upload_images

    async def resize_images(
        self,
        loop: asyncio.AbstractEventLoop,
        settings: Settings,
        named_image: NamedImageFile,
    ):
        resized_images = await loop.run_in_executor(
            self.process_pool,
            resize_images,
            named_image.name,
            self.sizes,
            settings.IMG_MODE,
        )

        return await loop.run_in_executor(
            None, self._get_temp_resized, settings, resized_images
        )

    async def save_images(
        self, images: UploadImages, extracted_color: Optional[str] = None
    ):
        return await s3_manager.upload_images(
            dict(images),
            dir_prefix=self.save_dir,
            extracted_color=extracted_color,
        )

    @contextmanager
    def convert_to_named(
        self, file: UploadFile
    ) -> Generator[NamedImageFile, None, None]:
        named_file = NamedTemporaryFile(delete=False, dir=self.upload_temp_dir.name)
        try:
            shutil.copyfileobj(file.file, named_file)
            # flush buffered in order to use it later within child processes
            named_file.flush()
        finally:
            file.file.close()

        try:
            yield named_file
        finally:
            named_file.close()
            Path(named_file.name).unlink(True)

    def _get_smallest(self, images: UploadImages):
        return images[-1][1]

    async def handle_compression(
        self,
        settings: SettingsDep,
        image: UploadFile,
        background_tasks: BackgroundTasks,
    ) -> CompressedImage:

        loop = asyncio.get_running_loop()
        await loop.run_in_executor(None, self.validate_image, settings, image)

        manager = self.convert_to_named(image)
        try:
            named_file = await loop.run_in_executor(None, manager.__enter__)
            temp_dir, images = await self.resize_images(loop, settings, named_file)
        finally:
            await loop.run_in_executor(None, manager.__exit__, None, None, None)

        extracted = None
        if self.extract_color:
            extracted = await loop.run_in_executor(
                self.process_pool,
                dominant_color,
                self._get_smallest(images),
                self.resize_on_extract,
            )

        image_key = await self.save_images(images, extracted)
        background_tasks.add_task(temp_dir.cleanup)
        return CompressedImage(
            image_key=image_key,
            extracted_color=extracted,
        )

    async def __call__(
        self,
        settings: SettingsDep,
        image: Annotated[UploadFile, File(description="Uploaded Image file")],
        background_tasks: BackgroundTasks,
    ) -> CompressedImage:
        async with self.semaphore:
            return await self.handle_compression(settings, image, background_tasks)
