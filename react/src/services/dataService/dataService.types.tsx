export type OrphanedFile = {
  name: string;
  directory: string;
};

export type OrphanedPackage = {
  name: string;
  repository: string[];
};

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