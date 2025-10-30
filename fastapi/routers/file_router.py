from fastapi import APIRouter, UploadFile
from fastapi.responses import PlainTextResponse, JSONResponse, FileResponse
import os
from .dataService import REPO_DIR, get_repo_directories, get_all_packages_with_repos
from .routers_types import (
    RenamePackageResponse,
    DeleteFileResponse,
    PackageFile,
)

router = APIRouter()

ROUTE_PATH = "/data/files"


# Rename File in Folder
@router.patch(ROUTE_PATH + "/{directory}/{package}")
async def rename_file(directory: str, package: str) -> RenamePackageResponse:
    file_path = os.path.join(REPO_DIR, directory)

    for element in os.listdir(file_path):
        if element == package and ".rpm" in element:
            os.rename(element, package)
            return RenamePackageResponse(old_name=element, new_name=package)

    return RenamePackageResponse(old_name=element, new_name="")


# Upload File to Folder
@router.post(ROUTE_PATH + "/{directory}")
async def upload_file(directory: str, file: UploadFile) -> bytes:
    file_path = os.path.join(REPO_DIR, directory)
    content = await file.read()

    os.makedirs(file_path, exist_ok=True)
    if file.filename:
        newfile_path = file_path + "/" + file.filename
        with open(newfile_path, "wb") as f:
            f.write(content)
    return content


# Get package File from Folder
@router.get(ROUTE_PATH + "/{directory}/{package}")
async def get_files(directory: str, package: str):
    file_path = os.path.join(REPO_DIR, directory)
    if not os.path.exists(file_path):
        return PlainTextResponse("No file found.")

    for element in os.listdir(file_path):
        if element == package:
            file: str = os.path.join(file_path, element)
            if os.path.isfile(file):
                return FileResponse(
                    file, media_type="application/octet-stream", filename=package
                )

    return PlainTextResponse("No file found.")


# Remove File from Folder
@router.delete(ROUTE_PATH + "/{directory}/{package}")
async def remove(directory: str, package: str) -> DeleteFileResponse:
    file_path = os.path.join(REPO_DIR, directory, package)
    is_deleted = False
    if os.path.isfile(file_path):
        os.remove(file_path)
        is_deleted = True

    return DeleteFileResponse(directory=directory, package=package, deleted=is_deleted)


# Get list of folders where a package has a file
@router.get(ROUTE_PATH + "/pkge/{package}", response_class=JSONResponse)
async def list_folders_containing_pkge(package: str) -> list[str]:
    try:
        contained_in: list[str] = []
        directory_list: list[str] = get_repo_directories()
        for directory in directory_list:
            directory_path = os.path.join(REPO_DIR, directory)
            for file in os.listdir(directory_path):
                if file == package and not os.path.isdir(file):
                    contained_in.append(directory)
                    break
        return contained_in
    except Exception as e:
        print(e)
        return []

    # Get list of files without a mention in a repository


@router.get(ROUTE_PATH + "/orphans", response_class=JSONResponse)
async def list_orphaned_files() -> list[PackageFile]:
    complete_list: list[PackageFile] = get_all_packages_with_repos()
    orphans: list[PackageFile] = []
    for directory in get_repo_directories():
        file_path = os.path.join(REPO_DIR, directory)

        for file in os.listdir(file_path):
            current: PackageFile = PackageFile(name=file, directory=directory)
            if current not in complete_list:
                orphans.append(current)

    return orphans
