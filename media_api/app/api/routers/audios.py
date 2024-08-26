from typing import Annotated, List
from fastapi import APIRouter, File, UploadFile


router = APIRouter()


@router.post("/audio")
async def compress_audio(
    file: Annotated[UploadFile, File(title="Uploaded audio file")]
):
    return 1


@router.post("/audios")
async def compress_audios(
    file: Annotated[List[UploadFile], File(title="Uploaded audio files")]
):
    return 1
