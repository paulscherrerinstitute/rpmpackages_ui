from fastapi import APIRouter, UploadFile
from fastapi.responses import PlainTextResponse, JSONResponse, FileResponse
import os
from shared_resources.dataService import (
    REPO_DIR_L,
    get_repo_directories,
    get_all_packages_with_repos,
    should_ignore,
    strip_to_base,
    safe_join,
    safe_join_second
)
from routers.routers_types import (
    RenamePackageResponse,
    DeleteFileResponse,
    PackageFile,
    RenameRequest,
    FetchInclusionResponse
)
from shared_resources.watchdog_manager import setHandlerSource

router = APIRouter()

ROUTE_PATH = "/data/files"


# Get list of folders where a file for the specified package exists
@router.get(ROUTE_PATH + "/pkge/{package}", response_class=JSONResponse)
async def list_folders_containing_pkge(package: str) -> list[FetchInclusionResponse]:
    try:
        contained_in: list[FetchInclusionResponse] = []
        directory_list: list[str] = get_repo_directories()
        for directory in directory_list:
            for idx, el in enumerate(REPO_DIR_L):
                directory_path = safe_join(el, strip_to_base(directory))
                if os.path.isdir(directory_path):
                    for file in os.listdir(directory_path):
                        if file == package and not os.path.isdir(file):
                            contained_in.append(FetchInclusionResponse(directory=directory, directory_index=idx))
                            break
        return contained_in
    except Exception as e:
        return [FetchInclusionResponse(directory=str(e), directory_index=-1)]


# Rename File in Folder
@router.patch(ROUTE_PATH + "/{package}")
async def rename_file(package: str, request: RenameRequest) -> RenamePackageResponse:
    setHandlerSource("internal")
    file_path = safe_join(REPO_DIR_L[request.directory_index], strip_to_base(request.directory))
    for element in os.listdir(file_path):
        os.rename(safe_join(file_path, strip_to_base(element)), safe_join(file_path, strip_to_base(package)))
        if element == package and ".rpm" in element:
            element_path = safe_join(file_path, strip_to_base(element))
            new_path = safe_join(file_path, strip_to_base(request.new_name))
            os.rename(element_path, new_path)
            return RenamePackageResponse(old_name=package, new_name=request.new_name)

    return RenamePackageResponse(old_name=package, new_name="")


# Upload File to Folder
@router.post(ROUTE_PATH + "/{directory}/{directory_index}")
async def upload_file(directory: str, directory_index: int, file: UploadFile) -> dict:
    setHandlerSource("internal")
    file_path = safe_join(REPO_DIR_L[directory_index], strip_to_base(directory))

    # Ensure the directory exists
    os.makedirs(file_path, exist_ok=True)

    if file.filename:
        newfile_path = safe_join(file_path, strip_to_base(file.filename))
        try:
            # Read and write the file in binary mode
            with open(newfile_path, "wb") as f:
                while chunk := await file.read(1024 * 1024):  # Read in chunks (1 MB)
                    f.write(chunk)
            return {"message": f"File '{file.filename}' uploaded successfully."}
        except Exception as e:
            return {"error": f"Failed to upload file: {str(e)}"}
    return {"error": "No filename provided in the uploaded file."}


# Get File from Folder by Packagename
@router.get(ROUTE_PATH + "/{directory}/{package}/{directory_index}")
async def get_files(directory: str, package: str, directory_index: int):
    file_path = safe_join(REPO_DIR_L[directory_index], strip_to_base(directory))
    if not os.path.exists(file_path):
        return PlainTextResponse("No file found.")

    for element in os.listdir(file_path):
 
        if element == package:
            file: str = safe_join(file_path, strip_to_base(element))
            if os.path.isfile(file):
                return FileResponse(
                    file, media_type="application/octet-stream", filename=package
                )

    return PlainTextResponse("No file found.")


# Remove File from Folder
@router.delete(ROUTE_PATH + "/{directory}/{package}/{directory_index}")
async def remove(directory: str, package: str, directory_index: int) -> DeleteFileResponse:
    setHandlerSource("internal")
    file_path = safe_join_second(REPO_DIR_L[directory_index], strip_to_base(directory), strip_to_base(package))
    is_deleted = False
    if os.path.isfile(file_path):
        os.remove(file_path)
        is_deleted = True

    return DeleteFileResponse(directory=directory, package=package, deleted=is_deleted)


# List Files that do not have an associated Package
@router.get(ROUTE_PATH + "/orphans", response_class=JSONResponse)
async def list_orphaned_files() -> list[PackageFile]:
    complete_list: list[PackageFile] = get_all_packages_with_repos()
    orphans: list[PackageFile] = []
    for directory in get_repo_directories():
        for idx, el in enumerate(REPO_DIR_L):
            file_path = safe_join(el, strip_to_base(directory))
            if should_ignore(file_path) or not os.path.isdir(file_path):
                continue
            for file in os.listdir(file_path):
                current: PackageFile = PackageFile(name=file, directory=directory, directory_index=idx)
                if current not in complete_list and ".rpm" in file:
                    orphans.append(current)
    return orphans
