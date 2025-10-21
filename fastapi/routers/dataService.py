from fastapi import APIRouter, HTTPException, UploadFile
from fastapi.responses import PlainTextResponse, JSONResponse
from pydantic import BaseModel
import os

router = APIRouter()

REPO_DIR = "static"


# Get List of Repositories
@router.get("/data", response_class=JSONResponse)
async def list_files():
    try:
        file_list: list[str] = []
        for el in os.listdir(REPO_DIR):
            if el not in file_list and not os.path.isdir(os.path.join(REPO_DIR, el)):
                file_list.append(el)
        return file_list
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Directory not found")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error reading directory: {str(e)}"
        )


# Get List of Folders
@router.get("/data/dir", response_class=JSONResponse)
async def list_folders():
    try:
        file_list: list[str] = []
        for el in os.listdir(REPO_DIR):
            if el not in file_list and os.path.isdir(os.path.join(REPO_DIR, el)):
                file_list.append(el)
        return file_list
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Directory not found")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error reading directory: {str(e)}"
        )


@router.post("/data/dir/{dir}")
async def upload_file(dir: str, file: UploadFile):
    file_path = os.path.join(REPO_DIR, dir)
    print(file_path)
    os.makedirs(file_path, exist_ok=True)
    with open(file_path, "wb+") as f:
        f.write(await file.read())

    return file


# Get Specific Package
def mapArr(s: str):
    arr = s.split("\n")
    return arr


@router.get("/data/pkge/{pkge}")
async def pkge_inc_in_repos(pkge):
    files = os.listdir(REPO_DIR)
    includedIn = []
    for f in files:
        file_path = os.path.join(REPO_DIR, f)

        # GET DATA
        first_arr = assemble_repo(file_path)
        contents = list(map(mapArr, first_arr))

        # Save if exists within
        for fArr in contents:
            for scArr in fArr:
                isIncluded = scArr == pkge
                if isIncluded:
                    includedIn.append(f)
                    break
            if isIncluded:
                break
    return includedIn


class PatchRequest(BaseModel):
    updatePackage: str
    repository: str


class PatchMoveRequest(BaseModel):
    repository: str
    outer_index: int
    inner_index: int


@router.patch("/data/move/pkge/{pkge}", response_class=JSONResponse)
async def move_pkge(pkge: str, request: PatchMoveRequest):
    file_path = os.path.join(REPO_DIR, request.repository)
    content = read_file(file_path)
    content = content.replace("\n" + pkge, "").split("\n\n#")
    for i, pk in enumerate(content):
        if i == request.outer_index:
            con: list[str] = pk.split("\n")
            if len(con) > 0:
                con.insert(request.inner_index, pkge)
            content[i] = "\n".join(con)
            break

    write_file(file_path, reassemble_repo(content))
    return content


@router.patch("/data/pkge/{pkge}", response_class=JSONResponse)
async def update_pkges(pkge, request: PatchRequest):
    file_path = os.path.join(REPO_DIR, request.repository)
    content = read_file(file_path).split("\n")

    for i, pk in enumerate(content):
        if pkge == pk:
            content[i] = request.updatePackage

    write_file(file_path, reassemble_repo_lb(content))
    return content


@router.get("/data/all", response_class=JSONResponse)
async def get_all_pkg():
    files = os.listdir(REPO_DIR)
    unique_pkges = []
    for f in files:
        file_path = os.path.join(REPO_DIR, f)

        # GET DATA
        first_arr = assemble_repo(file_path)
        contents = list(map(mapArr, first_arr))

        # Save if exists within
        for fArr in contents:
            for pk in fArr:
                isIncluded = unique_pkges.count(pk) == 0 and pk != "" and (".rpm" in pk)
                if isIncluded == True:
                    unique_pkges.append(pk)
    return unique_pkges


# Create new directory inside a repository
class DirectoryRequest(BaseModel):
    directory: str


@router.post("/data/new/{repo}")
async def create_dir(repo: str, request: DirectoryRequest):
    file_path = os.path.join(REPO_DIR, repo)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    text_by_category: list[str] = assemble_repo(file_path)

    for idx, t in enumerate(text_by_category):
        if request.directory in t:
            return {"added": False, "directory": request.directory, "index": idx}

    text_by_category.append(" " + request.directory)
    reassenbled_txt = reassemble_repo(text_by_category)

    write_file(file_path, reassenbled_txt)
    idx = len(text_by_category) - 1
    return {"added": True, "index": idx, "directory": request.directory}


# Delete directory
@router.delete("/data/new/{repo}")
async def remove_dir(repo: str, request: DirectoryRequest):
    file_path = os.path.join(REPO_DIR, repo)

    content = read_file(file_path).replace("\n\n# " + request.directory, "")
    write_file(file_path, content)
    return content


# Get Data from Repository
@router.get("/data/{file_name}", response_class=PlainTextResponse)
async def get_data(file_name: str):
    file_path = os.path.join(REPO_DIR, file_name)

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        contents = read_file(file_path)
        return PlainTextResponse(content=contents, media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")


# Create a new package inside a repository
class CreateRequest(BaseModel):
    item: str
    file_name: str
    subTitleIndex: int


@router.post("/data")
async def create_item(request: CreateRequest):
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


# Delete single Package
@router.delete("/data/pkge/{pkge}/{file_name}")
async def delete_item_repos(pkge: str, file_name: str):
    file_path = os.path.join(REPO_DIR, file_name)

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        # read
        contents = read_file(file_path)

        # save updated
        updated_contents = contents.replace("\n" + pkge, "")
        write_file(file_path, updated_contents)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")

    return [pkge, file_name]


def read_file(file_path: str):
    with open(file_path, "r", encoding="utf-8") as file:
        return file.read()


def assemble_repo(file_path: str):
    return read_file(file_path).split("\n\n#")


def write_file(file_path: str, content: str):
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(content)


def reassemble_repo(content: list[str]):
    return "\n\n#".join(content)


def reassemble_repo_lb(content: list[str]):
    return "\n".join(content)


def reassemble_repo_nested(content: list[list[str]]):
    joined_categories: list[str] = ["\n".join(c) for c in content]
    return "\n\n#".join(joined_categories)
