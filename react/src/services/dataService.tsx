import type {
  OrphanedFile,
  OrphanedPackage,
  RenameFileResponse,
  CreateDirectoryResponse,
  RemovePackageResponse,
  RepositoryResponse,
  EnvWindow,
  Repository,
  FolderInclusions,
} from "./dataService.types";

const env = (window as EnvWindow)._env_;
const API = env?.RPM_PACKAGES_PUBLIC_BACKEND_URL + "/data";
const PERMITTED_FILE_ENDING: string =
  env?.RPM_PACKAGES_CONFIG_ENDING ?? ".repo_cfg";

/////////////
// DIRECTORY
/////////////

const DIRECTORY_PATH = API + "/directory";

export async function addSubtitlteToRepository(
  repository: string,
  directory: string,
  directory_index: number
): Promise<CreateDirectoryResponse> {
  const body = JSON.stringify({
    directory: directory,
    directory_index
  });

  return await fetch(`${DIRECTORY_PATH}/${repository}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  }).then(async (response) => {
    const data: CreateDirectoryResponse = await response.json();
    return data;
  });
}

export async function removeSubtitleFromRepository(
  repository: string,
  directory: string,
  directory_index: number
) {
  const body = JSON.stringify({
    directory: directory.trim(),
    directory_index
  });
  return await fetch(`${DIRECTORY_PATH}/${repository}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body,
  }).then(async (response) => {
    const data = await response.text();
    return data;
  });
}

/////////////
// Files
/////////////

const FILES_PATH = API + "/files";

export async function getFileFromFolderForPackage(
  directory: string,
  pkge: string,
  directory_index: number
): Promise<File | null> {
  return await fetch(`${FILES_PATH}/${directory}/${pkge}/${directory_index}`).then(
    async (response) => {
      const content_type = response.headers.get("Content-Type");
      if (content_type == "application/octet-stream") {
        const data = await response.blob();
        return new File([data], pkge);
      } else {
        return null;
      }
    }
  );
}

export async function getFoldersIncludingFileForPackage(
  pkge: string
): Promise<FolderInclusions[]> {
  return await fetch(`${FILES_PATH}/pkge/${pkge}`).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function getOrphanedFiles(): Promise<OrphanedFile[]> {
  return await fetch(`${FILES_PATH}/orphans`).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function renameFileInFolder(
  pkge: string,
  new_name: string,
  directory: string,
  directory_index: number
): Promise<RenameFileResponse> {
  const body = JSON.stringify({
    new_name: new_name,
    directory: directory,
    directory_index
  });
  return await fetch(`${FILES_PATH}/${pkge}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function uploadFileToFolder(directory: string, file: File, directory_index: number) {
  const formData = new FormData();
  formData.append("file", file);
  return await fetch(`${FILES_PATH}/${directory}/${directory_index}`, {
    method: "POST",
    body: formData,
  }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function removeFileFromFolder(
  directory: string,
  pkge: string,
  directory_index: number
): Promise<RemovePackageResponse> {
  return await fetch(`${FILES_PATH}/${directory}/${pkge}/${directory_index}`, {
    method: "DELETE",
  }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

/////////////
// Package
/////////////

const PACKAGE_PATH = API + "/package";

export async function getAllUniquePackagesOverAll(): Promise<string[]> {
  return await fetch(`${PACKAGE_PATH}/all`).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function getRepositoriesOfPackage(
  pkge: string
): Promise<Repository[]> {
  return await fetch(`${PACKAGE_PATH}/${pkge}`).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function getOrphanedPackages(): Promise<OrphanedPackage[]> {
  return await fetch(`${PACKAGE_PATH}/orphans`).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function updatePackageInRepository(
  pkge: string,
  updatedPackage: string,
  repository: string,
  directory_index: number
): Promise<string[]> {
  const body = JSON.stringify({
    updatePackageInRepository: updatedPackage,
    repository: repository,
    directory_index
  });
  return await fetch(`${PACKAGE_PATH}/${pkge}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function movePackageToRepository(
  pkge: string,
  repository: string,
  outerIndex: number,
  innerIndex: number,
  directory_index: number
) {
  const body = JSON.stringify({
    repository,
    outer_index: outerIndex,
    inner_index: innerIndex,
    directory_index
  });
  return await fetch(`${PACKAGE_PATH}/${pkge}/move`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function addPackageToRepository(
  pkge: string,
  repository: string,
  insertIndex: number,
  directory_index: number
): Promise<string[][]> {
  // ensure Content-Type is set and body keys match required shape/order
  const body = JSON.stringify({
    item: pkge,
    file_name: repository,
    subtitle_index: insertIndex,
    directory_index: directory_index
  });

  return await fetch(`${PACKAGE_PATH}/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function removePackageFromRepository(
  pkge: string,
  repository: string,
  directory_index: number
): Promise<string[]> {
  return await fetch(
    `${PACKAGE_PATH}/${pkge}/${repository}${PERMITTED_FILE_ENDING}/${directory_index}`,
    {
      method: "DELETE",
    }
  ).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function getAllPackagesFromRepository(
  repository: string,
  directory_index: number
): Promise<string[][]> {
  const response = await fetch(
    `${PACKAGE_PATH}/repository/${repository}${PERMITTED_FILE_ENDING}/${directory_index}`
  );
  const text = await response.text();
  if (text.includes("File not found")) {
    return JSON.parse(text).detail;
  }

  const textByCategory = text.split("#").filter((t) => { return t.length > 0 })
  let txt: string[][] = textByCategory.map((t) => t.split("\n"));
  txt = txt.map((t) =>
    t.filter((tChild) => {
      return tChild.length > 0;
    })
  );
  return txt;
}

export async function getPackageInformation(repository: string, pkge: string, directory_index: number): Promise<{
  name: string,
  version: string,
  release: string,
  summary: string,
  description: string
  packager: string,
  arch: string,
  os: string,
  file_name: string
}> {
  return await fetch(
    `${PACKAGE_PATH}/details/${repository}/${pkge}/${directory_index}`
  ).then((val) => {
    return val.json();
  })
}

/////////////
// Repository
/////////////

const REPOSITORY_PATH = API + "/repository";

export async function getAllRepositories(): Promise<Repository[]> {
  return await fetch(`${REPOSITORY_PATH}`).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function addRepositoryAndFolder(
  repository: string,
  directory_index: number
): Promise<RepositoryResponse> {
  const body = JSON.stringify({
    repository: repository,
    directory_index: directory_index
  });
  return await fetch(`${REPOSITORY_PATH}/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  }).then(async (res) => {
    const data = await res.json();
    return data;
  });
}

export async function removeRepositoryAndFolder(
  repository: string,
  directory_idx: number
): Promise<RepositoryResponse> {
  return await fetch(
    `${REPOSITORY_PATH}/${repository.replace(PERMITTED_FILE_ENDING, "")}/${directory_idx}`,
    {
      method: "DELETE",
    }
  ).then(async (res) => {
    const data = await res.json();
    return data;
  });
}
