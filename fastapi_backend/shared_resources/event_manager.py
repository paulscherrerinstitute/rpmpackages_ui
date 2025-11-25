from collections import deque
from pydantic import BaseModel
from datetime import datetime
from fastapi import WebSocket

events = deque(maxlen=20)
subscribers: set[WebSocket] = set()


class Event(BaseModel):
    name: str
    type: str
    date: datetime


async def add_event(event: Event) -> None:
    events.append(event)
    await broadcast_event(event)


def get_all_events() -> list[Event]:
    return list(reversed(events))


async def broadcast_event(event: Event):
    dead = []
    for ws in subscribers:
        try:
            await ws.send_json((event.model_dump_json()))
        except Exception:
            dead.append(ws)
    for ws in dead:
        subscribers.remove(ws)
