import os
from routers.routers_types import PackageFile

REPO_DIR: str = os.getenv("RPM_PACKAGES_DIRECTORY", "")
FILE_ENDING: str = os.getenv("RPM_PACKAGES_CONFIG_ENDING", ".repo_cfg")

#########################
### General Functions ###
#########################


def read_file(file_path: str) -> str:
    with open(file_path, "r+", encoding="utf-8") as file:
        return file.read()


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
    for element in os.listdir(REPO_DIR):
        if element not in file_list and os.path.isdir(os.path.join(REPO_DIR, element)):
            file_list.append(element)
    return file_list


def get_all_packages() -> list[str]:
    files = os.listdir(REPO_DIR)
    unique_pkges: list[str] = []
    for f in files:
        file_path = os.path.join(REPO_DIR, f)
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
        file_path = os.path.join(REPO_DIR, f)
        if os.path.isfile(file_path):
            first_arr = assemble_repo(file_path)
            contents = list(map(split_lines, first_arr))
            dir = f.replace(FILE_ENDING, "")

            for category in contents:
                for pkge in category:
                    packages.append(PackageFile(name=pkge, directory=dir))

    return packages


def get_specific_package(pkge: str) -> list[str]:
    files = os.listdir(REPO_DIR)
    includedIn: list[str] = []
    for f in files:
        print(f)
        file_path = os.path.join(REPO_DIR, f)
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
                        includedIn.append(f)
                        break
                if isIncluded:
                    break
    return includedIn


def split_lines(s: str) -> list[str]:
    arr = s.split("\n")
    return arr
