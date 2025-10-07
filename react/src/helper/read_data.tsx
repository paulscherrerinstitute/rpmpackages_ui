export async function getData(file = "some") {
  const res = await fetch("../../public/" + file + ".repo_cfg");
  const text = await res.text();

  var textByCategory = text.split("\n\n#");
  var txt: string[][] = textByCategory.map((t) => t.split("\n"));
  txt = txt.map((t) =>
    t.filter((tChild) => {
      return tChild.length > 0;
    })
  );
  console.log(txt);
  return txt;
}

export function getAvailableRepos(path = "../../public/"){
    path;
    return ["some.repo_cfg", "someother.repo_cfg"];
}
