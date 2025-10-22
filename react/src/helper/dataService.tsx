const api: string = "http://localhost:8000/data";

export async function getPackagesFromRepo(
  repo: string = "some"
): Promise<string[][]> {
  const res = await fetch(`${api}/${repo}.repo_cfg`);
  const text = await res.text();

  var textByCategory = text.split("\n\n#");
  var txt: string[][] = textByCategory.map((t) => t.split("\n"));
  txt = txt.map((t) =>
    t.filter((tChild) => {
      return tChild.length > 0;
    })
  );
  return txt;
}

export async function getAvailableRepos(): Promise<string[]> {
  return await fetch(`${api}`).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function getAllPackages(): Promise<string[]> {
  return await fetch(`${api}/all`).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function getPackageInclusions(pkge: string): Promise<string[]> {
  return await fetch(`${api}/pkge/${pkge}`).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function uploadFile(directory: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return await fetch(`${api}/dir/${directory}`, {
    method: "POST",
    body: formData,
  }).then(async (res) => {
    const data = await res.json();
    return data;
  });
}

export async function updatePackage(
  pkge: string,
  updatedPackage: string,
  repository: string
): Promise<string[]> {
  const body = JSON.stringify({
    updatePackage: updatedPackage,
    repository: repository,
  });
  return await fetch(`${api}/pkge/${pkge}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  }).then(async (res) => {
    const data = await res.json();
    return data;
  });
}

export async function movePackage(
  pkge: string,
  repository: string,
  o_idx: number,
  i_idx: number
) {
  const body = JSON.stringify({
    repository: repository,
    outer_index: o_idx,
    inner_index: i_idx,
  });
  return await fetch(`${api}/move/pkge/${pkge}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  }).then(async (res) => {
    const data = await res.json();
    return data;
  });
}

export async function removePackageFromRepo(
  pkge: string,
  repo: string
): Promise<string[]> {
  return await fetch(`${api}/pkge/${pkge}/${repo}`, { method: "DELETE" }).then(
    async (response) => {
      const data = await response.json();
      return data;
    }
  );
}

export async function removeDirectory(repository: string, directory: string) {
  const body = JSON.stringify({
    directory: directory.trim(),
  });
  return await fetch(`${api}/new/${repository}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body,
  }).then(async (res) => {
    const data = await res.text();
    console.log(data);
    return data;
  });
}

export async function addPackageToRepo(
  pkge: string,
  repo: string,
  insertIdx: number
): Promise<string[][]> {
  // ensure Content-Type is set and body keys match required shape/order
  const body = JSON.stringify({
    item: pkge,
    file_name: repo,
    subTitleIndex: insertIdx,
  });

  return await fetch(`${api}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  }).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function createNewDirectoryInRepo(
  repo: string,
  directory: string
): Promise<CreateDirectoryResponse> {
  const body = JSON.stringify({
    directory: directory,
  });

  return await fetch(`${api}/new/${repo}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  }).then(async (response) => {
    const data: CreateDirectoryResponse = await response.json();
    return data;
  });
}

export type CreateDirectoryResponse = {
  added: string;
  index: number;
  directory: string;
};
