const api: string = "http://localhost:8000/data";

export async function getPackagesFromRepo(repo: string = "some") {
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

export async function getAvailableRepos() {
  return await fetch(`${api}`).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function getAllPackages() {
  return await fetch(`${api}/all`).then(async (response) => {
    const data = await response.json();
    return data;
  });
}

export async function getPackageInclusions(pkge: string){
  return await fetch(`${api}/pkge/${pkge}`).then(async (response) =>{
    const data = await response.json();
    return data;
  })
}

export async function removePackageFromRepo(pkge: string, repo: string) {
  return await fetch(`${api}/pkge/${pkge}/${repo}`, { method: "DELETE" }).then(
    async (response) => {
      const data = await response.json();
      return data;
    }
  );
}

export async function addPackageToRepo(
  pkge: string,
  repo: string,
  insertIdx: number
) {
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
){
  const body = JSON.stringify({
    directory: directory
  })

  return await fetch(`${api}/new/${repo}`, {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body,
  }).then (async (response) =>{
    const data: CreateDirectoryResponse = await response.json();
    return data;
  })
}

export type CreateDirectoryResponse = {
  added: string
  index: number
  directory: string
}