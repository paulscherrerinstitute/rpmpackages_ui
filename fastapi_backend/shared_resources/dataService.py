import os
from routers.routers_types import PackageFile, Repository

REPO_DIR: str = os.getenv("RPM_PACKAGES_DIRECTORY", "")
REPO_DIR_L = str(os.getenv("RPM_PACKAGES_DIRECTORY_L", "")).split(";")
FILE_ENDING: str = os.getenv("RPM_PACKAGES_CONFIG_ENDING", ".repo_cfg")
IGNORE_PATHS: str = os.getenv("RPM_PACKAGES_IGNORE_PATHS", "")

#########################
### General Functions ###
#########################


def read_file(file_path: str) -> str:
    if ".rpm" not in file_path:
        with open(file_path, "r", encoding="utf-8") as file:
            data = file.read()
            return data
    return ""

def assemble_repo(file_path: str) -> list[str]:
    return read_file(file_path).split("\n\n#")


def write_file(file_path: str, content: str) -> None:
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(content)


def reassemble_repo(content: list[str]) -> str:
    return "\n\n#".join(content)


def reassemble_repo_linebreak(content: list[str]) -> str:
    return "\n".join(content)


def reassemble_repo_nested(content: list[list[str]]) -> str:
    joined_categories: list[str] = ["\n".join(c) for c in content]
    return "\n\n#".join(joined_categories)


def get_repo_directories() -> list[str]:
    file_list: list[str] = []
    for el in REPO_DIR_L:
        for element in os.listdir(el):
            if element not in file_list and os.path.isdir(os.path.join(el, element)):
                file_list.append(element)
    return file_list


def get_all_packages() -> list[str]:
    unique_pkges: list[str] = []
    for el in REPO_DIR_L:
        files = os.listdir(el)
        for f in files:
            file_path = os.path.join(el, f)
            if os.path.isfile(file_path):

                # GET DATA
                first_arr = assemble_repo(file_path)
                contents = list(map(split_lines, first_arr))

                # Save if exists within
                for category in contents:
                    for pk in category:
                        isIncluded = (
                            unique_pkges.count(pk) == 0 and pk != "" and (".rpm" in pk)
                        )
                        if isIncluded:
                            unique_pkges.append(pk)
    return unique_pkges


def get_all_packages_with_repos() -> list[PackageFile]:
    files = os.listdir(REPO_DIR)
    packages: list[PackageFile] = []

    for f in files:
        split: list[str] = f.split(".")
        appropriate_filename: bool = False
        if len(split) > 1:
            ending = f.split(".")[1]
            appropriate_filename = ending == FILE_ENDING.replace(".", "")
        f_path: str = os.path.join(REPO_DIR, f)
        if os.path.isfile(f_path) and appropriate_filename:
            first_arr = assemble_repo(f_path)
            contents = list(map(split_lines, first_arr))
            dir = f.replace(FILE_ENDING, "")

            for category in contents:
                for pkge in category:
                    packages.append(PackageFile(name=pkge, directory=dir))

    return packages


def get_specific_package(pkge: str) -> list[Repository]:
    includedIn: list[Repository] = []
    for idx, el in enumerate(REPO_DIR_L):
        files = os.listdir(el)
        for f in files:
            file_path = os.path.join(el, f)
            if (
                os.path.isfile(file_path)
                and FILE_ENDING in file_path
                and (FILE_ENDING + "n") not in file_path
            ):

                # GET DATA
                first_arr = assemble_repo(file_path)
                contents = list(map(split_lines, first_arr))

                # Save if exists within
                for category in contents:
                    for pk in category:
                        isIncluded = pk == pkge
                        if isIncluded:
                            includedIn.append(Repository(element=f, directory_index=idx))
                            break
                    if isIncluded:
                        break
    return includedIn


def split_lines(s: str) -> list[str]:
    arr = s.split("\n")
    return arr


def should_ignore(file_path: str):
    paths: list[str] = IGNORE_PATHS.split(";")
    for path in paths:
        if path == file_path:
            return True
    return False
