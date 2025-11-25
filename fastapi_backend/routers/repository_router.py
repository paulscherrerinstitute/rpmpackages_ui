from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import os, shutil
from shared_resources.dataService import REPO_DIR, FILE_ENDING
from routers.routers_types import RepositoryRequest, RepositoryResponse
from shared_resources.watchdog_manager import setHandlerSource

router = APIRouter()

ROUTER_PATH = "/data/repository"


## Create repository and folder
@router.post(ROUTER_PATH + "/new")
async def create_repository(
    request: RepositoryRequest,
) -> RepositoryResponse:
    setHandlerSource("internal")
    folder_path = os.path.join(REPO_DIR, request.repository)
    repository_path = os.path.join(REPO_DIR, request.repository + FILE_ENDING)

    if folder_path:
        os.mkdir(folder_path)
    if repository_path:
        with open(repository_path, "w"):
            pass
    return RepositoryResponse(
        repository=request.repository,
        repository_location=repository_path,
        folder_location=folder_path,
    )


# Get All Repositories
@router.get(ROUTER_PATH, response_class=JSONResponse)
async def list_files() -> list[str]:
    try:
        file_list: list[str] = []
        for element in os.listdir(REPO_DIR):
            if (
                element not in file_list
                and not os.path.isdir(os.path.join(REPO_DIR, element))
                and FILE_ENDING in element
                # ignore legacy .repo_cfgn-Files
                and FILE_ENDING + "n" not in element
            ):
                file_list.append(element)
        return file_list
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Directory not found")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error reading directory: {str(e)}"
        )


# Delete Repository and Folder
@router.delete(ROUTER_PATH + "/{repository}")
async def snap_repository_and_folder(repository: str):  # -> RepositoryResponse:
    setHandlerSource("internal")
    repository_path = os.path.join(REPO_DIR, repository + FILE_ENDING)
    folder_path = os.path.join(REPO_DIR, repository)
    if repository_path and os.path.exists(repository_path):
        os.remove(repository_path)
    if folder_path and os.path.exists(folder_path):
        shutil.rmtree(folder_path)

    return RepositoryResponse(
        repository=repository,
        repository_location=repository_path,
        folder_location=folder_path,
    )
