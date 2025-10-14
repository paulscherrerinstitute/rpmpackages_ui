from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse, JSONResponse
from pydantic import BaseModel
import os

router = APIRouter()

REPO_DIR = "static"


@router.get("/data/{file_name}", response_class=PlainTextResponse)
async def get_data(file_name: str):
    file_path = os.path.join(REPO_DIR, file_name)

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            contents = f.read()
        return PlainTextResponse(content=contents, media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")


@router.get("/data", response_class=JSONResponse)
async def list_files():
    try:
        return JSONResponse(os.listdir(REPO_DIR))
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Directory not found")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error reading directory: {str(e)}"
        )


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

    with open(file_path, "r", encoding="utf-8") as file:
        # File into List[List[str]]
        text_by_category: list[str] = file.read().split("\n\n#")
        txt = [t.split("\n") for t in text_by_category]
        txt = [[line for line in t if len(line) > 0] for t in txt]

    if len(txt) > 0 and len(txt) >= idx:
        # Append item to specified place
        (txt[idx]).append(item)

        with open(file_path, "w", encoding="utf-8") as file:
            # ITEMS! Reassemble!
            joined_categories = ["\n".join(category) for category in txt]
            reassenbled_txt = "\n\n#".join(joined_categories)
            file.write(reassenbled_txt)
    return txt


@router.get("/data/pkge/{pkge}")
async def pkge_inc_in_repos(pkge):
    return ["some.repo_cfg", "someother.repo_cfg", pkge]


@router.delete("/data/pkge/{pkge}/{file_name}")
async def delete_item_repos(pkge: str, file_name: str):
    file_path = os.path.join(REPO_DIR, file_name)

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        # read
        with open(file_path, "r", encoding="utf-8") as file:
            contents = file.read()

        # save updated
        updated_contents = contents.replace("\n" + pkge, "")
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(updated_contents)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")

    return [pkge, file_name]
