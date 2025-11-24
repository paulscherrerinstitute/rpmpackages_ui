from fastapi import FastAPI
from routers.file_router import router as file_router
from routers.directory_router import router as directory_router
from routers.package_router import router as package_router
from routers.repository_router import router as repository_router
from routers.root_router import router as root_router
from fastapi.middleware.cors import CORSMiddleware
from shared_resources.watchdog_manager import start_watchdog, stop_watchdog

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    start_watchdog()


@app.on_event("shutdown")
def shutdown():
    stop_watchdog()

app.include_router(file_router)
app.include_router(directory_router)
app.include_router(package_router)
app.include_router(repository_router)
app.include_router(root_router)
