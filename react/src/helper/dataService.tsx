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

export async function getAvailableRepos(path: string = "../../public/") {
  var repoList: string[] = ["some.repo_cfg", "someother.repo_cfg"];
  return repoList.map((r) => r);
}

export async function removePackageFromRepo(pkge: string, repo: string) {
  console.log(`Removing ${pkge} from ${repo}`);
}

export async function addPackageToRepo(
  pkge: string,
  repo: string,
  titleToInsertAt: string
) {
  console.log(`Adding ${pkge} to ${repo} at ${titleToInsertAt}`);
}
