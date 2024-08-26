from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Request

from .deps.images import ImageCompressor
from .deps.auth import verify_token

from .api.routers import router

from .core.celery import app as celery_app


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("App startup")
    yield
    print("App shutdown")
    ImageCompressor._on_shutdown()


app = FastAPI(lifespan=lifespan, dependencies=[Depends(verify_token)])

# @app.middleware("http")
# async def add_process_time_header(request: Request, call_next):
#     await asyncio.sleep(5)
#     response = await call_next(request)
#     return response


app.include_router(router, prefix="/api")
