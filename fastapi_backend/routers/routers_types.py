from pydantic import BaseModel


class PackageFile(BaseModel):
    name: str
    directory: str


class Package(BaseModel):
    name: str
    repository: list[str]


class PackageResponse(BaseModel):
    name: str
    version: str
    release: str
    summary: str
    description: str
    packager: str
    arch: str
    os: str


class RenamePackageResponse(BaseModel):
    old_name: str
    new_name: str


class RenameRequest(BaseModel):
    new_name: str
    directory: str


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


class SubtitleRequest(BaseModel):
    directory: str


class CreateSubtitleResponse(BaseModel):
    added: bool
    directory: str
    index: int


class CreateRequest(BaseModel):
    item: str
    file_name: str
    subTitleIndex: int


class RepositoryRequest(BaseModel):
    repository: str
    directory_index: int


class RepositoryResponse(BaseModel):
    repository: str
    repository_location: str
    folder_location: str

class Repository(BaseModel):
    element: str
    dir_idx: int