from fastapi import APIRouter, WebSocket
from shared_resources.event_manager import subscribers
from shared_resources.dataService import REPO_DIR_L

router = APIRouter()


@router.get("/health", description="Simply tests connectivity")
async def healthcheck() -> dict[str, str]:
    return {"message": "Alive and Well!"}


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

@router.get("/paths", description="Returns REPO_DIR_L")
async def get_paths() -> list[str]:
    return REPO_DIR_L