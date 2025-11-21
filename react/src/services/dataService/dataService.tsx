import {
  type OrphanedFile,
  type OrphanedPackage,
  type RenameFileResponse,
  type CreateDirectoryResponse,
  type RemovePackageResponse,
  type RepositoryResponse,
} from "./dataService.types";
import { type EnvWindow } from "../services.types";
import { msalInstance } from "../auth/AuthProvider";
import { handleLoginRequired } from "../infoService";

const env = (window as EnvWindow)._env_;
// const API = "http://localhost:8000" + "/data";
const API = env?.RPM_PACKAGES_PUBLIC_BACKEND_URL + "/data";
const PERMITTED_FILE_ENDING: string =
  env?.RPM_PACKAGES_CONFIG_ENDING ?? ".repo_cfg";
const TOKEN: string = msalInstance.getActiveAccount()?.idToken ?? "";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${TOKEN}`
}

/////////////
// DIRECTORY
/////////////

const DIRECTORY_PATH = API + "/directory";

export async function addSubtitlteToRepository(
  repository: string,
  directory: string
): Promise<CreateDirectoryResponse> {
  const body = JSON.stringify({
    directory: directory,
  });
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${TOKEN}`
  }
  await handleLoginRequired();
  return await fetch(`${DIRECTORY_PATH}/${repository}`, {
    method: "POST",
    headers: headers,
    body,
  }).then(async (response) => {
    const data: CreateDirectoryResponse = await response.json();
    return data;
  });
}

export async function removeSubtitleFromRepository(
  repository: string,
  directory: string
) {
  const body = JSON.stringify({
    directory: directory.trim(),
  });
  await handleLoginRequired();
  return await fetch(`${DIRECTORY_PATH}/${repository}`, {
    method: "DELETE",
    headers: DEFAULT_HEADERS,
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
  pkge: string
): Promise<File | null> {
  await handleLoginRequired();
  return await fetch(`${FILES_PATH}/${directory}/${pkge}`, {
    headers: DEFAULT_HEADERS
  }).then(
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
): Promise<string[]> {
  await handleLoginRequired();
  return await fetch(`${FILES_PATH}/pkge/${pkge}`, { headers: DEFAULT_HEADERS }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function getOrphanedFiles(): Promise<OrphanedFile[]> {
  await handleLoginRequired();
  return await fetch(`${FILES_PATH}/orphans`, { headers: DEFAULT_HEADERS }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function renameFileInFolder(
  pkge: string,
  new_name: string,
  directory: string
): Promise<RenameFileResponse> {
  await handleLoginRequired();
  const body = JSON.stringify({
    new_name: new_name,
    directory: directory,
  });
  return await fetch(`${FILES_PATH}/${pkge}`, {
    method: "PATCH",
    headers: DEFAULT_HEADERS,
    body,
  }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function uploadFileToFolder(directory: string, file: File) {
  await handleLoginRequired();
  const formData = new FormData();
  formData.append("file", file);
  return await fetch(`${FILES_PATH}/${directory}`, {
    method: "POST",
    body: formData,
    headers: DEFAULT_HEADERS
  }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function removeFileFromFolder(
  directory: string,
  pkge: string
): Promise<RemovePackageResponse> {
  await handleLoginRequired();
  return await fetch(`${FILES_PATH}/${directory}/${pkge}`, {
    method: "DELETE",
    headers: DEFAULT_HEADERS
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
  await handleLoginRequired();
  return await fetch(`${PACKAGE_PATH}/all`, { headers: DEFAULT_HEADERS }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function getRepositoriesOfPackage(
  pkge: string
): Promise<string[]> {
  await handleLoginRequired();
  return await fetch(`${PACKAGE_PATH}/${pkge}`, { headers: DEFAULT_HEADERS }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function getOrphanedPackages(): Promise<OrphanedPackage[]> {
  await handleLoginRequired();
  return await fetch(`${PACKAGE_PATH}/orphans`, { headers: DEFAULT_HEADERS }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function updatePackageInRepository(
  pkge: string,
  updatedPackage: string,
  repository: string
): Promise<string[]> {
  await handleLoginRequired();
  const body = JSON.stringify({
    updatePackageInRepository: updatedPackage,
    repository: repository,
  });
  return await fetch(`${PACKAGE_PATH}/${pkge}`, {
    method: "PATCH",
    headers: DEFAULT_HEADERS,
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
  innerIndex: number
) {
  await handleLoginRequired();
  const body = JSON.stringify({
    repository: repository,
    outer_index: outerIndex,
    inner_index: innerIndex,
  });
  return await fetch(`${PACKAGE_PATH}/${pkge}/move`, {
    method: "PATCH",
    headers: DEFAULT_HEADERS,
    body,
  }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function addPackageToRepository(
  pkge: string,
  repository: string,
  insertIndex: number
): Promise<string[][]> {
  await handleLoginRequired();
  // ensure Content-Type is set and body keys match required shape/order
  const body = JSON.stringify({
    item: pkge,
    file_name: repository,
    subTitleIndex: insertIndex,
  });

  return await fetch(`${PACKAGE_PATH}/new`, {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body,
  }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function removePackageFromRepository(
  pkge: string,
  repository: string
): Promise<string[]> {
  await handleLoginRequired();
  return await fetch(
    `${PACKAGE_PATH}/${pkge}/${repository}${PERMITTED_FILE_ENDING}`,
    {
      method: "DELETE",
      headers: DEFAULT_HEADERS
    }
  ).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function getAllPackagesFromRepository(
  repository: string
): Promise<string[][]> {
  await handleLoginRequired();
  const response = await fetch(
    `${PACKAGE_PATH}/repository/${repository}${PERMITTED_FILE_ENDING}`, {
    headers: DEFAULT_HEADERS
  }
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

export async function getPackageInformation(repository: string, pkge: string): Promise<{
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
  await handleLoginRequired();
  return await fetch(
    `${PACKAGE_PATH}/details/${repository}/${pkge}`
  ).then((val) => {
    return val.json();
  })
}

/////////////
// Repository
/////////////

const REPOSITORY_PATH = API + "/repository";

export async function getAllRepositories(): Promise<string[]> {
  await handleLoginRequired();
  return await fetch(`${REPOSITORY_PATH}`, { headers: DEFAULT_HEADERS }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function addRepositoryAndFolder(
  repository: string
): Promise<RepositoryResponse> {
  await handleLoginRequired();
  const body = JSON.stringify({
    repository: repository,
  });
  return await fetch(`${REPOSITORY_PATH}/new`, {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body,
  }).then(async (res) => {
    const data = await res.json();
    return data;
  });
}

export async function removeRepositoryAndFolder(
  repository: string
): Promise<RepositoryResponse> {
  await handleLoginRequired();
  return await fetch(
    `${REPOSITORY_PATH}/${repository.replace(PERMITTED_FILE_ENDING, "")}`,
    {
      method: "DELETE",
      headers: DEFAULT_HEADERS,
    }
  ).then(async (res) => {
    const data = await res.json();
    return data;
  });
}
