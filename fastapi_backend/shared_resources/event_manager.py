from collections import deque
from pydantic import BaseModel
from datetime import datetime
from fastapi import WebSocket

events = deque(maxlen=20)

class Event(BaseModel):
    name: str
    type: str
    date: datetime


def add_event(event: Event) -> None:
    events.append(event)


def get_all_events() -> list[str]:
    list(events).reverse()
    return list(events)