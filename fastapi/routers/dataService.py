from fastapi import APIRouter, HTTPException, UploadFile
from fastapi.responses import PlainTextResponse, JSONResponse, FileResponse
from pydantic import BaseModel
import os

router = APIRouter()

REPO_DIR = "static"
FILE_ENDING = ".repo_cfg"

#############
### Types ###
#############


class FileOrphan(BaseModel):
    name: str
    directory: str


class PackageOrphan(BaseModel):
    name: str
    repository: list[str]


class RenamePackageResponse(BaseModel):
    old_name: str
    new_name: str


class DeleteFileResponse(BaseModel):
    directory: str
    package: str
    deleted: bool


class PatchMoveRequest(BaseModel):
    repository: str
    outer_index: int
    inner_index: int


class PatchRequest(BaseModel):
    updatePackageInRepository: str
    repository: str


class DirectoryRequest(BaseModel):
    directory: str


class CreateDirectoryResponse(BaseModel):
    added: bool
    directory: str
    index: int


class CreateRequest(BaseModel):
    item: str
    file_name: str
    subTitleIndex: int


#################
### Endpoints ###
#################


# Get All Repositories
@router.get("/data", response_class=JSONResponse)
async def list_files() -> list[str]:
    try:
        file_list: list[str] = []
        for element in os.listdir(REPO_DIR):
            if (
                element not in file_list
                and not os.path.isdir(os.path.join(REPO_DIR, element))
                and FILE_ENDING in element
            ):
                file_list.append(element)
        return file_list
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Directory not found")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error reading directory: {str(e)}"
        )


# Get list of files without a mention in a repository
@router.get("/data/dir/file/orphans", response_class=JSONResponse)
async def list_orphaned_files() -> list[FileOrphan]:
    complete_list: list[str] = get_all_packages()
    orphans: list[FileOrphan] = []
    for directory in get_repo_directories():
        file_path = os.path.join(REPO_DIR, directory)
        for file in os.listdir(file_path):
            if file not in complete_list:
                file_orphan: FileOrphan = FileOrphan(name=file, directory=directory)
                orphans.append(file_orphan)

    return orphans


# Get list of packages without a corresponding file
@router.get("/data/dir/pkge/orphans", response_class=JSONResponse)
async def list_orphaned_pkge() -> list[PackageOrphan]:
    complete_list: list[str] = []
    orphans: list[PackageOrphan] = []

    for directory in get_repo_directories():
        file_path = os.path.join(REPO_DIR, directory)
        for file in os.listdir(file_path):
            complete_list.append(file)

    for package in get_all_packages():
        if package not in complete_list:
            package_orphan: PackageOrphan = PackageOrphan(
                name=package, repository=get_specific_package(package)
            )
            orphans.append(package_orphan)

    return orphans


# Get list of directories where a package has a file
@router.get("/data/dir/pkge/{package}", response_class=JSONResponse)
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


# Rename File in directory
@router.patch("/data/dir/{directory}/{package}")
async def rename_file(directory: str, package: str) -> RenamePackageResponse:
    file_path = os.path.join(REPO_DIR, directory)

    for element in os.listdir(file_path):
        if element == package and ".rpm" in element:
            os.rename(element, package)
            return RenamePackageResponse(old_name=element, new_name=package)

    return RenamePackageResponse(old_name=element, new_name="")


# Upload File to directory
@router.post("/data/dir/{directory}")
async def upload_file(directory: str, file: UploadFile) -> bytes:
    file_path = os.path.join(REPO_DIR, directory)
    content = await file.read()

    os.makedirs(file_path, exist_ok=True)
    if file.filename:
        newfile_path = file_path + "/" + file.filename
        with open(newfile_path, "wb") as f:
            f.write(content)
    return content


# Get package File from Directory
@router.get("/data/dir/{directory}/{package}")
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


# Remove File from directory
@router.delete("/data/dir/{directory}/{package}")
async def remove(directory: str, package: str) -> DeleteFileResponse:
    file_path = os.path.join(REPO_DIR, directory, package)
    is_deleted = False
    if os.path.isfile(file_path):
        os.remove(file_path)
        is_deleted = True

    return DeleteFileResponse(directory=directory, package=package, deleted=is_deleted)


# Get list of repositories where a package is included
@router.get("/data/pkge/{package}")
async def pkge_inc_in_repos(package: str) -> list[str]:
    return get_specific_package(package)


# Move package to repository
@router.patch("/data/move/pkge/{package}", response_class=JSONResponse)
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


# Update Package in repository
@router.patch("/data/pkge/{package}", response_class=JSONResponse)
async def update_pkges(package, request: PatchRequest) -> list[str]:
    file_path = os.path.join(REPO_DIR, request.repository)
    content = read_file(file_path).split("\n")

    for idx, pk in enumerate(content):
        if package == pk:
            content[idx] = request.updatePackageInRepository

    write_file(file_path, reassemble_repo_linebreak(content))
    return content


# Return all packages over all
@router.get("/data/all", response_class=JSONResponse)
async def get_all_pkg() -> list[str]:
    return get_all_packages()


# Create add directory in repository
@router.post("/data/new/{repository}")
async def create_dir(
    repository: str, request: DirectoryRequest
) -> CreateDirectoryResponse:
    file_path = os.path.join(REPO_DIR, repository)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    text_by_category: list[str] = assemble_repo(file_path)

    for idx, txt_cat in enumerate(text_by_category):
        if request.directory in txt_cat:
            return CreateDirectoryResponse(
                added=False, directory=request.directory, index=idx
            )

    text_by_category.append(" " + request.directory)
    reassenbled_txt = reassemble_repo(text_by_category)

    write_file(file_path, reassenbled_txt)
    idx = len(text_by_category) - 1
    return CreateDirectoryResponse(added=True, index=idx, directory=request.directory)


# Delete directory in repository
@router.delete("/data/new/{repository}")
async def remove_dir(repository: str, request: DirectoryRequest) -> str:
    file_path = os.path.join(REPO_DIR, repository)

    content = read_file(file_path).replace("\n\n# " + request.directory, "")
    write_file(file_path, content)
    return content


# Get packages from specific repository
@router.get("/data/{file_name}", response_class=PlainTextResponse)
async def get_data(file_name: str) -> PlainTextResponse:
    file_path = os.path.join(REPO_DIR, file_name)

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        contents = read_file(file_path)
        return PlainTextResponse(content=contents, media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")


# Create a new package inside a repository
@router.post("/data")
async def create_item(request: CreateRequest) -> list[list[str]]:
    item = request.item
    idx = request.subTitleIndex
    file_name = request.file_name

    file_path = os.path.join(REPO_DIR, file_name)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    text_by_category: list[str] = assemble_repo(file_path)
    txt = [t.split("\n") for t in text_by_category]
    txt = [[line for line in t if len(line) > 0] for t in txt]

    if len(txt) > 0 and len(txt) >= idx:
        # Append item to specified place
        (txt[idx]).append(item)

        reassenbled_txt = reassemble_repo_nested(txt)
        write_file(file_path, reassenbled_txt)
    return txt


# Delete single package inside a repository
@router.delete("/data/pkge/{repository}/{file_name}")
async def delete_item_repos(repository: str, file_name: str) -> list[str]:
    file_path = os.path.join(REPO_DIR, file_name)

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        # read
        contents = read_file(file_path)

        # save updated
        updated_contents = contents.replace("\n" + repository, "")
        write_file(file_path, updated_contents)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")

    return [repository, file_name]


#########################
### General Functions ###
#########################


def read_file(file_path: str) -> str:
    with open(file_path, "r+", encoding="utf-8") as file:
        return file.read()


def assemble_repo(file_path: str) -> list[str]:
    return read_file(file_path).split("\n\n#")


def write_file(file_path: str, content: str) -> None:
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(content)


def reassemble_repo(content: list[str]) -> str:
    return "\n\n#".join(content)


def reassemble_repo_linebreak(content: list[str]) -> str:
    return "\n".join(content)


def reassemble_repo_nested(content: list[list[str]]) -> str:
    joined_categories: list[str] = ["\n".join(c) for c in content]
    return "\n\n#".join(joined_categories)


def get_repo_directories() -> list[str]:
    file_list: list[str] = []
    for element in os.listdir(REPO_DIR):
        if element not in file_list and os.path.isdir(os.path.join(REPO_DIR, element)):
            file_list.append(element)
    return file_list


def get_all_packages() -> list[str]:
    files = os.listdir(REPO_DIR)
    unique_pkges: list[str] = []
    for f in files:
        file_path = os.path.join(REPO_DIR, f)
        if os.path.isfile(file_path):

            # GET DATA
            first_arr = assemble_repo(file_path)
            contents = list(map(split_lines, first_arr))

            # Save if exists within
            for category in contents:
                for pk in category:
                    isIncluded = (
                        unique_pkges.count(pk) == 0 and pk != "" and (".rpm" in pk)
                    )
                    if isIncluded == True:
                        unique_pkges.append(pk)
    return unique_pkges


def get_specific_package(pkge: str) -> list[str]:
    files = os.listdir(REPO_DIR)
    includedIn: list[str] = []
    for f in files:
        file_path = os.path.join(REPO_DIR, f)
        if os.path.isfile(file_path):

            # GET DATA
            first_arr = assemble_repo(file_path)
            contents = list(map(split_lines, first_arr))

            # Save if exists within
            for category in contents:
                for pk in category:
                    isIncluded = pk == pkge
                    if isIncluded:
                        includedIn.append(f)
                        break
                if isIncluded:
                    break
    return includedIn


def split_lines(s: str) -> list[str]:
    arr = s.split("\n")
    return arr
