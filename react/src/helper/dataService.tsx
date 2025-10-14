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

export async function removePackageFromRepo(pkge: string, repo: string) {
  return await fetch(`${api}/pkge/${pkge}/${repo}`, {method: 'DELETE'}).then(async (response) => {
    const data = await response.json()
    return data;
  })
}

export async function addPackageToRepo(
  pkge: string,
  repo: string,
  titleToInsertAt: string
) {
  console.log(`Adding ${pkge} to ${repo} at ${titleToInsertAt}`);
}
