import type { PackageSearchObject, Repository } from "./dataService.types";
import type { EnvWindow } from "./dataService.types";

const PERMITTED_FILE_ENDING: string =
    (window as EnvWindow)._env_?.RPM_PACKAGES_CONFIG_ENDING ?? ".repo_cfg";

export function handleSearch_RepositoryandPackages(
    searchString: string,
    element: Repository,
    allPackages: PackageSearchObject[]
): boolean {
    
    // 1) Search by repository name
    if (element.element.includes(searchString) || searchString.length === 0)
        return true;
    
    if(!allPackages || allPackages.length === 0) return false
    // 2) Search by package name + repository membership
    if (searchString.startsWith("pk:")) {

        const repoName = element.element.replace(PERMITTED_FILE_ENDING, "");

        const s_string = searchString.replace("pk:", "")
        const matchingPackages = allPackages.filter(
            (pkg) => pkg.name.includes(s_string)
        );

        return matchingPackages.some((pkg) =>
            pkg.repository.includes(repoName)
        );
    }
    return false;
}