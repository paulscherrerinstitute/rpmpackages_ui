from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import os
import shutil
from shared_resources.dataService import REPO_DIR, FILE_ENDING, REPO_DIR_L
from routers.routers_types import RepositoryRequest, RepositoryResponse, Repository
from shared_resources.watchdog_manager import setHandlerSource

router = APIRouter()

ROUTER_PATH = "/data/repository"


## Create repository and folder
@router.post(ROUTER_PATH + "/new")
async def create_repository(
    request: RepositoryRequest,
) -> RepositoryResponse:
    setHandlerSource("internal")
    folder_path = os.path.join(REPO_DIR_L[request.directory_index], request.repository)
    repository_path = os.path.join(REPO_DIR_L[request.directory_index], request.repository + FILE_ENDING)

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
async def list_files() -> list[Repository]:
    try:
        file_list: list[Repository] = []
        for idx, li in enumerate(REPO_DIR_L):
            for element in os.listdir(li):
                if (
                    element not in file_list
                    and not os.path.isdir(os.path.join(li, element))
                    and FILE_ENDING in element
                    # ignore legacy .repo_cfgn-Files
                    and FILE_ENDING + "n" not in element
                ):
                    file_list.append(Repository(element=element, directory_index=idx))
        return file_list
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error reading directory: {str(e)}"
        )


# Delete Repository and Folder
@router.delete(ROUTER_PATH + "/{repository}/{directory_index}")
async def snap_repository_and_folder(
    repository: str, directory_index: int
):  # -> RepositoryResponse:
    setHandlerSource("internal")
    repository_path = os.path.join(
        REPO_DIR_L[directory_index], repository + FILE_ENDING
    )
    folder_path = os.path.join(REPO_DIR_L[directory_index], repository)
    if repository_path and os.path.exists(repository_path):
        os.remove(repository_path)
    if folder_path and os.path.exists(folder_path):
        shutil.rmtree(folder_path)

    return RepositoryResponse(
        repository=repository,
        repository_location=repository_path,
        folder_location=folder_path,
    )
