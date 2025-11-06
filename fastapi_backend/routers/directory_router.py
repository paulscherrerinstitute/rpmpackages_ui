from fastapi import APIRouter, HTTPException
import os
from ..shared_resources.dataService import REPO_DIR, assemble_repo, reassemble_repo, write_file, read_file
from .routers_types import SubtitleRequest, CreateSubtitleResponse

router = APIRouter()

ROUTER_PATH = "/data/directory"

# Add subtitle in repository
@router.post(ROUTER_PATH + "/{repository}")
async def create_dir(
    repository: str, request: SubtitleRequest
) -> CreateSubtitleResponse:
    file_path = os.path.join(REPO_DIR, repository)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    text_by_category: list[str] = assemble_repo(file_path)
    print(len(text_by_category))

    for idx, txt_cat in enumerate(text_by_category):
        if request.directory in txt_cat:
            return CreateSubtitleResponse(
                added=False, directory=request.directory, index=idx
            )

    if len(text_by_category) == 1 and text_by_category[0] == "":
        reassenbled_txt = "# " + request.directory
    else:
        text_by_category.append(" " + request.directory)
        reassenbled_txt = reassemble_repo(text_by_category)

    write_file(file_path, reassenbled_txt)
    print(reassenbled_txt)
    idx = len(text_by_category) - 1
    return CreateSubtitleResponse(added=True, index=idx, directory=request.directory)


# Delete subtitle in repository
@router.delete(ROUTER_PATH +"/{repository}")
async def remove_dir(repository: str, request: SubtitleRequest) -> str:
    file_path = os.path.join(REPO_DIR, repository)

    content = read_file(file_path).replace("\n\n# " + request.directory, "")
    write_file(file_path, content)
    return content