from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse, PlainTextResponse
import os
from .dataService import (
    REPO_DIR,
    read_file,
    write_file,
    reassemble_repo,
    FILE_ENDING,
    assemble_repo,
    reassemble_repo_nested,
    reassemble_repo_linebreak,
    get_all_packages,
    get_specific_package,
    get_repo_directories,
    get_all_packages_with_repos,
)
from .routers_types import PatchMoveRequest, CreateRequest, PatchRequest, Package

router = APIRouter()

ROUTE_PATH = "/data/package"


# Move package to repository
@router.patch(ROUTE_PATH + "/{package}/move", response_class=JSONResponse)
async def move_pkge(package: str, request: PatchMoveRequest) -> list[str]:
    file_path = os.path.join(REPO_DIR, request.repository)
    content = read_file(file_path).replace("\n" + package, "").split("\n\n#")
    for idx, pk in enumerate(content):
        if idx == request.outer_index:
            current_content: list[str] = pk.split("\n")
            if len(current_content) > 0:
                current_content.insert(request.inner_index, package)
            content[idx] = "\n".join(current_content)
            break

    write_file(file_path, reassemble_repo(content))
    return content


# Create a new package inside a repository
@router.post(ROUTE_PATH + "/new")
async def create_item(request: CreateRequest) -> list[list[str]]:
    package = request.item
    idx = request.subTitleIndex
    file_name = request.file_name
    if FILE_ENDING not in file_name:
        file_name += FILE_ENDING

    file_path = os.path.join(REPO_DIR, file_name)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    text_by_category: list[str] = assemble_repo(file_path)
    txt = [t.split("\n") for t in text_by_category]
    txt = [[line for line in t if len(line) > 0] for t in txt]

    if idx == -1:
        idx = len(text_by_category) - 1
    if len(txt) > 0 and len(txt) >= idx:
        # Append item to specified place
        (txt[idx]).append(package)

        reassenbled_txt = reassemble_repo_nested(txt)
        write_file(file_path, reassenbled_txt)
    return txt


# Delete single package inside a repository
@router.delete(ROUTE_PATH + "/{package}/{file_name}")
async def delete_item_repos(package: str, file_name: str) -> list[str]:
    file_path = os.path.join(REPO_DIR, file_name)

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        # read
        contents = read_file(file_path)

        # save updated
        updated_contents = contents.replace("\n" + package, "")
        write_file(file_path, updated_contents)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")

    return [package, file_name]


# Update Package in repository
@router.patch(ROUTE_PATH + "/{package}", response_class=JSONResponse)
async def update_pkges(package, request: PatchRequest) -> list[str]:
    file_path = os.path.join(REPO_DIR, request.repository)
    content = read_file(file_path).split("\n")

    for idx, pk in enumerate(content):
        if package == pk:
            content[idx] = request.updatePackageInRepository

    write_file(file_path, reassemble_repo_linebreak(content))
    return content


# Return all packages over all
@router.get(ROUTE_PATH + "/all", response_class=JSONResponse)
async def get_all_pkg() -> list[str]:
    return get_all_packages()


# Get list of packages without a corresponding file
@router.get(ROUTE_PATH + "/orphans", response_class=JSONResponse)
async def list_orphaned_pkge() -> list[Package]:
    complete_list: list[Package] = []
    orphans: list[Package] = []

    for directory in get_repo_directories():
        file_path = os.path.join(REPO_DIR, directory)
        for file in os.listdir(file_path):
            complete_list.append(Package(name=file, repository=[directory]))

    for package in get_all_packages_with_repos():
        p: Package = Package(name=package.name, repository=[package.directory])
        if p not in complete_list and "rpm" in p.name:
            orphans.append(p)
    return orphans


# Get packages from specific repository
@router.get(ROUTE_PATH + "/repository/{file_name}", response_class=PlainTextResponse)
async def get_data(file_name: str) -> PlainTextResponse:
    file_path = os.path.join(REPO_DIR, file_name)

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        contents = read_file(file_path)
        return PlainTextResponse(content=contents, media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")


# Get list of repositories where a package is included
@router.get(ROUTE_PATH + "/{package}")
async def pkge_inc_in_repos(package: str) -> list[str]:
    return get_specific_package(package)
