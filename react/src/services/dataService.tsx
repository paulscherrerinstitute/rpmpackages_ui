import {
  type OrphanedFile,
  type OrphanedPackage,
  type RenameFileResponse,
  type CreateDirectoryResponse,
  type RemovePackageResponse,
  type RepositoryResponse,
  type EnvWindow,
} from "./dataService.types";

const env = (window as EnvWindow)._env_;
const API = env?.RPM_PACKAGES_BACKEND_URL + "/data";
const PERMITTED_FILE_ENDING: string =
  env?.RPM_PACKAGES_CONFIG_ENDING ?? ".repo_cfg";

///////////
// Health
///////////

export async function getBackendHealth(): Promise<string> {
  const health_url = env?.RPM_PACKAGES_BACKEND_URL;
  try {
    const health = await fetch(`${health_url}/health`).then(async (res) => {
      const data = res.json();
      return data;
    });
    if (health) {
      console.info(
        "[" + new Date().toISOString() + "]",
        "BACKEND: ",
        health.message
      );
      return health.message;
    }
    return "";
  } catch {
    console.info(
      "[" + new Date().toISOString() + "]",
      "BACKEND:",
      "Dead and definitely not well"
    );
    return "Does not feel so good";
  }
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
  directory: string
) {
  const body = JSON.stringify({
    directory: directory.trim(),
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
  pkge: string
): Promise<File | null> {
  return await fetch(`${FILES_PATH}/${directory}/${pkge}`).then(
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
  directory: string
): Promise<RenameFileResponse> {
  const body = JSON.stringify({
    new_name: new_name,
    directory: directory,
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

export async function uploadFileToFolder(directory: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return await fetch(`${FILES_PATH}/${directory}`, {
    method: "POST",
    body: formData,
  }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function removeFileFromFolder(
  directory: string,
  pkge: string
): Promise<RemovePackageResponse> {
  return await fetch(`${FILES_PATH}/${directory}/${pkge}`, {
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
): Promise<string[]> {
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
  repository: string
): Promise<string[]> {
  const body = JSON.stringify({
    updatePackageInRepository: updatedPackage,
    repository: repository,
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
  innerIndex: number
) {
  const body = JSON.stringify({
    repository: repository,
    outer_index: outerIndex,
    inner_index: innerIndex,
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
  insertIndex: number
): Promise<string[][]> {
  // ensure Content-Type is set and body keys match required shape/order
  const body = JSON.stringify({
    item: pkge,
    file_name: repository,
    subTitleIndex: insertIndex,
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
  repository: string
): Promise<string[]> {
  return await fetch(
    `${PACKAGE_PATH}/${pkge}/${repository}${PERMITTED_FILE_ENDING}`,
    {
      method: "DELETE",
    }
  ).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function getAllPackagesFromRepository(
  repository: string
): Promise<string[][]> {
  const response = await fetch(
    `${PACKAGE_PATH}/repository/${repository}${PERMITTED_FILE_ENDING}`
  );
  const text = await response.text();
  if (text.includes("File not found")) {
    return JSON.parse(text).detail;
  }

  let textByCategory = text.split("\n\n#");
  let txt: string[][] = textByCategory.map((t) => t.split("\n"));
  txt = txt.map((t) =>
    t.filter((tChild) => {
      return tChild.length > 0;
    })
  );
  return txt;
}

/////////////
// Repository
/////////////

const REPOSITORY_PATH = API + "/repository";

export async function getAllRepositories(): Promise<string[]> {
  return await fetch(`${REPOSITORY_PATH}`).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function addRepositoryAndFolder(
  repository: string
): Promise<RepositoryResponse> {
  const body = JSON.stringify({
    repository: repository,
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
  repository: string
): Promise<RepositoryResponse> {
  return await fetch(
    `${REPOSITORY_PATH}/${repository.replace(PERMITTED_FILE_ENDING, "")}`,
    {
      method: "DELETE",
    }
  ).then(async (res) => {
    const data = await res.json();
    return data;
  });
}
