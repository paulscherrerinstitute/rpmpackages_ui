const API: string = "http://localhost:8000/data";
const FILE_ENDING: string = "repo_cfg";

/////////
/* GET */
/////////

export async function getAllPackagesFromRepository(
  repository: string
): Promise<string[][]> {
  const response = await fetch(`${API}/${repository}.${FILE_ENDING}`);
  const text = await response.text();

  var textByCategory = text.split("\n\n#");
  var txt: string[][] = textByCategory.map((t) => t.split("\n"));
  txt = txt.map((t) =>
    t.filter((tChild) => {
      return tChild.length > 0;
    })
  );
  return txt;
}

export async function getAllRepositories(): Promise<string[]> {
  return await fetch(`${API}`).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function getAllPackagesOverall(): Promise<string[]> {
  return await fetch(`${API}/all`).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function getRepositoriesOfPackage(pkge: string): Promise<string[]> {
  return await fetch(`${API}/pkge/${pkge}`).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function getPackageFileFromDirectory(
  directory: string,
  pkge: string
): Promise<File | null> {
  return await fetch(`${API}/dir/${directory}/${pkge}`).then(
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

export async function getDirectoriesIncludingPkge(pkge: string): Promise<string[]> {
  return await fetch(`${API}/dir/pkge/${pkge}`).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function getOrphanedFiles(): Promise<OrphanedFile[]> {
  return await fetch(`${API}/dir/file/orphans`).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function getOrphanedPackages(): Promise<OrphanedPackage[]> {
  return await fetch(`${API}/dir/pkge/orphans`).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

///////////
/* PATCH */
///////////

export async function updatePackageInRepository(
  pkge: string,
  updatedPackage: string,
  repository: string
): Promise<string[]> {
  const body = JSON.stringify({
    updatePackageInRepository: updatedPackage,
    repository: repository,
  });
  return await fetch(`${API}/pkge/${pkge}`, {
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
  return await fetch(`${API}/move/pkge/${pkge}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function renameFileInDirectory(
  directory: string,
  pkge: string
): Promise<RenameFileResponse> {
  return await fetch(`${API}/dir/${directory}/${pkge}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

//////////
/* POST */
//////////

export async function uploadFileToDirectory(directory: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return await fetch(`${API}/dir/${directory}`, {
    method: "POST",
    body: formData,
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

  return await fetch(`${API}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function addDirectoryToRepository(
  repository: string,
  directory: string
): Promise<CreateDirectoryResponse> {
  const body = JSON.stringify({
    directory: directory,
  });

  return await fetch(`${API}/new/${repository}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  }).then(async (response) => {
    const data: CreateDirectoryResponse = await response.json();
    return data;
  });
}

////////////
/* DELETE */
////////////

export async function removePackageFromRepository(
  pkge: string,
  repository: string
): Promise<string[]> {
  return await fetch(`${API}/pkge/${pkge}/${repository}`, {
    method: "DELETE",
  }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function removeFileFromDirectory(
  directory: string,
  pkge: string
): Promise<RemovePackageResponse> {
  return await fetch(`${API}/dir/${directory}/${pkge}`, {
    method: "DELETE",
  }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function removeDirectoryFromRepository(repository: string, directory: string) {
  const body = JSON.stringify({
    directory: directory.trim(),
  });
  return await fetch(`${API}/new/${repository}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body,
  }).then(async (response) => {
    const data = await response.text();
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
