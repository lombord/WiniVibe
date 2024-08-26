from typing import Union
from pydantic import BaseModel


class CompressedImage(BaseModel):
    image_key: str
    extracted_color: Union[str, None] = None
