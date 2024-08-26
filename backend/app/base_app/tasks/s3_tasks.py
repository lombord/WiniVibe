from celery.utils.log import get_task_logger


from .s3_manager import s3_manager
from .utils import shared_task, once_shared_task

logger = get_task_logger(__name__)


@once_shared_task
def delete_s3_dir(dir: str):
    s3_manager.delete_objects(dir)


@once_shared_task
def commit_new_image(image_pk):
    from ..models import CompressedImage

    comp_image = CompressedImage.objects.get(pk=image_pk)
    og_prefix = comp_image.image_key
    if not og_prefix:
        return

    new_prefix, meta_data = s3_manager.commit_files(og_prefix)

    if new_prefix:
        comp_image.image_key = new_prefix
        comp_image._update_image_keys()
        if meta_data:
            comp_image.set_valid_color(meta_data.get("extracted_color"))
    else:
        comp_image._reset_image()

    comp_image._commit_save()
