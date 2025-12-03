export type OrphanedFile = {
  name: string;
  directory: string;
};

export type OrphanedPackage = {
  name: string;
  repository: string[];
};

export type Repository = {
  element: string
  dir_idx: number
}

export type RenameFileResponse = {
  old_name: string;
  new_name: string;
};

export type CreateDirectoryResponse = {
  added: string;
  index: number;
  directory: string;
};

export type RemovePackageResponse = {
  directory: string;
  package: string;
  deleted: boolean;
};

export type RepositoryResponse = {
  repository: string;
  repository_location: string;
  folder_location: string;
};

export interface EnvWindow extends Window {
  _env_?: {
    RPM_PACKAGES_INTERNAL_BACKEND_URL: string;
    RPM_PACKAGES_CONFIG_ENDING: string;
    RPM_PACKAGES_PUBLIC_BACKEND_URL: string;
  };
}

export const NONE =
{
  name: "None",
  version: "None",
  release: "None",
  summary: "None",
  description: "None",
  packager: "None",
  arch: "None",
  os: "None",
  file_name: ""
}

export const EMPTY = {
  name: "",
  version: "",
  release: "",
  summary: "",
  description: "",
  packager: "",
  arch: "",
  os: "",
  file_name: ""
}