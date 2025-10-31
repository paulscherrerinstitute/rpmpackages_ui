import { permittedFileEnding } from "../components/helpers/NavbarHelper";

const API: string = "http://localhost:8000/data";

/////////////
// DIRECTORY
/////////////

export async function addSubtitlteToRepository(
  repository: string,
  directory: string
): Promise<CreateDirectoryResponse> {
  const body = JSON.stringify({
    directory: directory,
  });

  return await fetch(`${API}/directory/${repository}`, {
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
  return await fetch(`${API}/directory/${repository}`, {
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

export async function getFileFromFolderForPackage(
  directory: string,
  pkge: string
): Promise<File | null> {
  return await fetch(`${API}/files/${directory}/${pkge}`).then(
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
  return await fetch(`${API}/files/pkge/${pkge}`).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function getOrphanedFiles(): Promise<OrphanedFile[]> {
  return await fetch(`${API}/files/orphans`).then(async (response) => {
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
  return await fetch(`${API}/files/${pkge}`, {
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
  return await fetch(`${API}/files/${directory}`, {
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
  return await fetch(`${API}/files/${directory}/${pkge}`, {
    method: "DELETE",
  }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

/////////////
// Package
/////////////

export async function getAllUniquePackagesOverAll(): Promise<string[]> {
  return await fetch(`${API}/package/all`).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function getRepositoriesOfPackage(
  pkge: string
): Promise<string[]> {
  return await fetch(`${API}/package/${pkge}`).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function getOrphanedPackages(): Promise<OrphanedPackage[]> {
  return await fetch(`${API}/package/orphans`).then(async (response) => {
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
  return await fetch(`${API}/package/${pkge}`, {
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
  return await fetch(`${API}/package/${pkge}/move`, {
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

  return await fetch(`${API}/package/new`, {
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
    `${API}/package/${pkge}/${repository}${permittedFileEnding}`,
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
    `${API}/package/repository/${repository}${permittedFileEnding}`
  );
  const text = await response.text();
  if (text.includes("File not found")) {
    return JSON.parse(text).detail;
  }

  var textByCategory = text.split("\n\n#");
  var txt: string[][] = textByCategory.map((t) => t.split("\n"));
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

export async function getAllRepositories(): Promise<string[]> {
  return await fetch(`${API}/repository`).then(async (response) => {
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
  return await fetch(`${API}/repository/new`, {
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
    `${API}/repository/${repository.replace(permittedFileEnding, "")}`,
    {
      method: "DELETE",
    }
  ).then(async (res) => {
    const data = await res.json();
    return data;
  });
}

///////////
/* Types */
///////////

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
