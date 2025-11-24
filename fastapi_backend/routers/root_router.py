from fastapi import APIRouter
from socket import gethostname
from os import getenv

router = APIRouter()


@router.get("/health", description="Simply tests connectivity")
async def healthcheck() -> dict[str, str]:
    return {"message": "Alive and Well!"}


@router.get("/host", description="Gets current host name")
async def get_host() -> str:
    return gethostname()


@router.get("/location", description="Returns directory of rpms")
async def get_rpm_location() -> str:
    dir: str | None = getenv("RPM_PACKAGES_DIRECTORY")
    return dir if dir is not None else ""
