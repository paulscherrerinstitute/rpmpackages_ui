export async function getData(file = "../../public/some.repo_cfg"){
    const res = await fetch(file);
    const text = await res.text();

    var textByCategory = text.split("\n\n#")
    var txt: string[][] = textByCategory.map((t) => t.split("\n"));
    txt = txt.map((t) =>t.filter((tChild) => {
       return tChild.length > 0
    }));
    console.log(txt);
    return txt
}