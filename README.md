# RPM PACKAGES UI

## HOW TO USE

### General

This is a UI for a RPM packages and their associated repositories to better view and manage them.
The repositories (hereafter refered to as `Repositories`) are basically files with lists of packages (hereafter refered to as `Packages`), which are associated with a folder (hereafter refered to as `Directory`), which contains files that correspond to the packages defined within the above mentioned repositories (hereafter refered to as simply `Files`).

As external changes can still be made to the directory, a watchdog is implemented into the backend that triggers a reload on the frontend if any file is determined to be changed from another source that isn't the backend.

### Repositories

#### OVERALL

`Repositories`:  
This view shows all available repositories that exist within the path that has been specified for the GUI.
It only searches and displayes repositories with the file ending specified (as standard ".repo_cfg").

> ℹ️".repo_cfgn" files are not supported: However, you can change the file ending to ".repo_cfg" and it should work.

The search field in the top corner can be used to search the list of repositories for a specific repository. The cross next clears the search field and shows the entire list again.
To view the contents of a repository, hover over the row you want until it turns grey and click.

### Packages for a repository

`/Packages/SomeRepositoryThatExists`:  
This view shows all packages contained in a repository file. It is essentially a modified file editor for those repository files. There is a search field and corresponding clear button as well to search for specific packages.

#### General

The repository files are generally structured to have some subtitles and some packages for each one of them:  
Those subtitles are marked bold - with the button `Add Subtitle` at the top of the page, a new subtitle can be added.

#### Subtitles

Each subtitle has two buttons at the right (the bigger ones):

- `Add ➕`, which opens a popup with which a new package can be added. A corresponding file can and should be uploaded here as well. After saving, the file and package both get added to their respective directory and repository.
- `Remove 🪣`, which removes a subtitle from the directory.
  > ℹ️ This will not remove any packages or files associated with the subtitle, only the subtitle.

#### Packages

The packages can be moved around between subtitles, or to simply change their order, by `dragging and dropping` them to the desired place.
There are two buttons, that are provided to edit any package:

- `Edit ✏️`, which opens a similar popup to the `Add` popup at the subtitle-levels. The name of the package is displayed above, with some information about the package being displayed (which is extracted directly from the rpm-file itself). The title of the package can be edited via the `Edit ✏️` button besides it. The metadata is queried from the package directly and can't (or rather shouldn't) be edited.
  - If this is the case, the name of the file is shown - clicking on it downloads the associated file. The waste basket 🪣 besides it deletes the package from the associated directory.
  - If this is not the case, an upload-input is shown where you can upload and save your file.
- `Remove 🪣`, which removes the package from the repository.

### Packages in general

`Packages`:  
This view shows all unique packages across all repositories. Like most other views, it also includes a search field and a corresponding clear button.
By clicking on a package when hovering over it, a popup displays the same information as the `Edit` of `Packages for a repository`, combined with some other functions:

- At the top:
  - `Add to other repository ➕`, which opens another popup, where this package can be added to a repository it is not already in.
  - `Edit across all repositories ✏️`, which edits the name across all repositories.
  - `Delete in all repositories`, which removes the package across all repositories it is mentioned in.
- In the middle (mentions):
  - This view shows the list of all repositories that the package is included in, with a small box showing whether the package has an associated file within its directory.
  - `Remove 🪣`, which removes the mention of the package from the repository.
- At the bottom:
  - This shows the name of a file if any exists (and its download link) or the upload button for adding a new file (uploading here uploads it to all mentioned directories). It also includes two more buttons:
  - `Add to all directories ➕`, which adds the file to all directories where a corresponding package exists, but no associated file.
  - `Delete from all directories 🪣`, which removes the file from all directories it exists within.

### Orphans

`Orphans`:  
This view shows all orphaned files and packages, i.e. those packages without an associated file and files without an associated package. Both have some buttons to easily get rid of them. And as any other view, this also has search fields and clear buttons for both lists.
It consists of two parts:

- File Orphans (File but no associated package within a repository)
  - `Add Orphaned file to repository ➕`, which adds the package to the repository. This is based on the current directory that the file is within.
  - `Delete Orphaned file completely 🪣`, which deletes the file completely.
- Package Orphans (Package in a repository but no associated file)
  - `Open in repository ↗️`, which opens the appropriate `Repository` at the spot where the package exists.
  - `Add File ➕`, which opens a small dialog where a file can be uploaded and added to the package.
  - `Remove from repository 🪣`, which removes the packages from the repository

## SETUP LOCALLY

### ENVIRONMENT

For the local setup to work properly, the following env variables can (or must be set):

- RPM_PACKAGES_DIRECTORY: Place where your files and rpmpackages are located (ℹ️ - this field is required when running docker-compose
- RPM_PACKAGES_CONFIG_ENDING: Ending of the configuration-files (defaults to ".repo_cfg")
- RPM_PACKAGES_INTERNAL_BACKEND_URL: Specifies the location of the backend (defaults to "http://localhost:8000")
- RPM_PACKAGES_PUBLIC_BACKEND_URL: Specifies the public location of the backend (when setting up locally, the actual URL and when running via NGINX then the URL path (ex. `/api` for the path: https://host_name/api))

### DOCKER-COMPOSE

The repository contains two docker-compose files provide environments to run the application: `docker-compose.yml` and `docker-compose-current-version.yml`. The former builds from the current, local code, whereas the latter pulls the images from the latest named version from github.

```
BUILD FROM LOCAL
docker compose -f ./docker-compose.yml up -d --build

PULL FROM REMOTE
docker compose -f ./docker-compose-current-version.yml up -d --build
```

### FOR DEVELOPMENT

#### FRONTEND

The frontend is a `React` application. To set it up, navigate into the react folder and start it from there

```
cd .\react
npm i
npm run dev
```

#### BACKEND

The backend is a `FastAPI`-python application. To set it up, use a virtual environment and apply the requirements-file.

```
cd .\fastapi-backend
.\venv\Scripts\Activate.ps1
pip install -r .\requirements.txt
fastapi dev
```

## Deployment

Deployment is recommended to be done via [ansible-playbook](https://docs.ansible.com/projects/ansible/latest/playbook_guide/playbooks_intro.html).
For this purpose, three files are provided for: `docker_pull_and_run.yml`, `docker_stop_and_remove.yml` and `hosts.yml`.

## PRE-Deployment

Before you deploy anything, make sure that the program works as expected on your local instance (or better, a testing one). Also run lint on both the back- and frontend (most of the dependency-warnings in react-lint can be ignored and should not be changed). To deploy a version, simply tag a commit and wait for the github actions to publish the packages to the github package registry.

After that, simply run `docker_pull_and_run.yml`.

## docker_pull_and_run.yml

Pulls the newest docker images (that are tagged) from the github container registry and runs them in docker-containers with a conjoined docker_network.
The command for running it is this (run it within wsl):

```
sudo ansible-playbook docker_pull_and_run.yml -i hosts.yml -u USERNAME --ask-pass
```

Any hosts that are to be deployed to must be declared in `hosts.yml` - alternativels, it can be substituted by a simple list `-i some-test-server,` that is terminated by a trailing comma.

## docker_stop_and_remove.yml

Stops the containers and removes them, including the network and volumes.
The command is the same as with pull_and_run, except with another filepath.

```
sudo ansible-playbook docker_pull_and_run.yml -i hosts.yml -u USERNAME --ask-pass
```

Any hosts that are to be stopped to must be declared in `hosts.yml` - alternativels, it can be substituted by a simple list `-i some-test-server,` that is terminated by a trailing comma.
