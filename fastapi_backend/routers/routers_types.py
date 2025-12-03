from pydantic import BaseModel
from typing import Optional


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
    directory_index: int


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
    directory_index: int


class SubtitleRequest(BaseModel):
    directory: str
    directory_index: int

class FetchInclusionResponse(BaseModel):
    directory: str
    directory_index: int

class CreateSubtitleResponse(BaseModel):
    added: bool
    directory: str
    index: int


class CreateRequest(BaseModel):
    item: str
    file_name: str
    subtitle_index: int
    directory_index: int


class RepositoryRequest(BaseModel):
    repository: str
    directory_index: int


class RepositoryResponse(BaseModel):
    repository: str
    repository_location: str
    folder_location: str

class Repository(BaseModel):
    element: str
    directory_index: int