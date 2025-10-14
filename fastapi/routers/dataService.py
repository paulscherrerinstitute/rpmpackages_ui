from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse, JSONResponse
from pydantic import BaseModel
import os

router = APIRouter()

REPO_DIR = "static"

class Item(BaseModel):
    name: str
    version: str
    version_note: str | None
    distribution: str
    architecture: str

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
        raise HTTPException(status_code=500, detail=f"Error reading directory: {str(e)}")
    

@router.post("/data")
async def create_item(item: Item):
    return item

@router.get("/data/pkge/{pkge}")
async def pkge_inc_in_repos(pkge):
    return []

@router.delete("/data/pkge/{pkge}")
async def delete_item(pkge: str):
    return pkge