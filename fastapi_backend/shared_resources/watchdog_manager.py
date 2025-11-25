# Define a global event_handler instance
from watchdog.events import FileSystemEvent, FileSystemEventHandler
from watchdog.observers import Observer
from shared_resources.event_manager import add_event, Event
from datetime import datetime
import os, asyncio


class DirectoryEventHandler(FileSystemEventHandler):
    def __init__(self, source="external") -> None:
        self.source = source
        self.default_source = source

    def getSource(self) -> str:
        return self.source

    def resetSource(self) -> None:
        self.source = self.default_source

    def on_any_event(self, event: FileSystemEvent) -> None:
        type = event.event_type
        if self.source == "external" and (
            type == "modified"
            or type == "moved"
            or type == "deleted"
            or type == "created"
        ):
            ev = Event(
                name=str(event.src_path), type=event.event_type, date=datetime.now()
            )
            asyncio.run(add_event(ev))
        self.resetSource()


# Global event_handler instance
event_handler = DirectoryEventHandler(source="external")


def setHandlerSource(source: str):
    event_handler.source = source


# Initialize and start the watchdog observer
def start_watchdog():
    rpm_directory = os.getenv("RPM_PACKAGES_DIRECTORY")
    if rpm_directory:
        global observer
        observer = Observer()
        observer.schedule(event_handler, rpm_directory, recursive=False)
        observer.start()
    else:
        print("Environment variable RPM_PACKAGES_DIRECTORY is not set.")


def stop_watchdog():
    global observer
    if observer:
        observer.stop()
        observer.join()
