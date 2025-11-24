from collections import deque
from pydantic import BaseModel
from datetime import datetime
from fastapi import WebSocket

events = deque(maxlen=20)
active_connections = []


class Event(BaseModel):
    name: str
    type: str
    date: datetime


def add_event(event: Event) -> None:
    events.append(event)

    print(active_connections)
    for connection in active_connections:
        try:
            connection.send_text(str(event))
        except Exception as e:
            print(e)


def get_all_events() -> list[str]:
    list(events).reverse()
    return list(events)


def add_connection(websocket: WebSocket):
    """Add a new WebSocket client to the active connections list"""
    active_connections.append(websocket)


def remove_connection(websocket: WebSocket):
    """Remove a WebSocket client from the active connections list"""
    active_connections.remove(websocket)