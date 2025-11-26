from fastapi import APIRouter, WebSocket
from socket import gethostname
from os import getenv
from shared_resources.event_manager import subscribers

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


@router.websocket("/ws")
async def get_events(websocket: WebSocket):
    await websocket.accept()
    # Add to subscribers
    subscribers.add(websocket)

    try:
        while True:
            await websocket.receive_text()  # keeps connection alive
    except Exception:
        subscribers.remove(websocket)
