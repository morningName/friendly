# Friendly Terminal - Command Set

## GIT

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
### Showing Information

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `git show changes`             | `git status`                                | Shows which files you have modified               |
| `git show diff`                | `git diff`                                  | Shows line-by-line changes in your files          |
| `git show diff staged`         | `git diff --staged`                         | Shows changes that are staged for commit          |
| `git show history`             | `git log --oneline -10`                     | Shows your last 10 commits                        |
| `git show history all`         | `git log --oneline`                         | Shows full commit history                         |
| `git show history detailed`    | `git log`                                   | Shows commits with full details and messages      |
| `git show branches`            | `git branch -a`                             | Shows all local and remote branches               |
| `git show branches local`      | `git branch`                                | Shows only local branches                         |
| `git show branches remote`     | `git branch -r`                             | Shows only remote branches                        |
| `git show blame file.js`       | `git blame file.js`                         | Shows who wrote each line of a file               |
| `git show remote`              | `git remote -v`                             | Shows remote repository URLs                      |
| `git show tags`                | `git tag`                                   | Shows all tags                                    |
| `git show stash`               | `git stash list`                            | Shows all stashed changes                         |
| `git show commit abc123`       | `git show abc123`                           | Shows details of a specific commit                |

### Saving Changes

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `git save "message"`           | `git add . && git commit -m "message"`      | Saves all your changes with a description         |
| `git save file.js "message"`   | `git add file.js && git commit -m "msg"`    | Saves only one file with a description            |
| `git save amend`               | `git commit --amend`                        | Modifies the last commit (message or files)       |
| `git save amend "new message"` | `git commit --amend -m "new message"`       | Changes the last commit message                   |
| `git stage file.js`            | `git add file.js`                           | Stages a file for the next commit                 |
| `git stage all`                | `git add .`                                 | Stages all changed files                          |
| `git unstage file.js`          | `git reset HEAD file.js`                    | Removes a file from staging area                  |
| `git unstage all`              | `git reset HEAD`                            | Removes all files from staging area               |

### Syncing with Remote

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `git sync upload`              | `git push`                                  | Uploads your commits to the remote repository     |
| `git sync upload force`        | `git push --force`                          | Force uploads (overwrites remote history)         |
| `git sync upload origin main`  | `git push origin main`                      | Uploads to specific remote and branch             |
| `git sync upload tags`         | `git push --tags`                           | Uploads all tags to remote                        |
| `git sync download`            | `git pull`                                  | Downloads latest changes from remote repository   |
| `git sync download rebase`     | `git pull --rebase`                         | Downloads and replays your commits on top         |
| `git sync`                     | `git pull && git push`                      | Downloads then uploads (full sync)                |
| `git fetch`                    | `git fetch`                                 | Downloads remote changes without merging          |
| `git fetch all`                | `git fetch --all`                           | Downloads from all remotes                        |

### Rewinding (Undoing Commits)

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `git rewind save`              | `git reset --soft HEAD~1`                   | Undoes last commit, keeps changes staged          |
| `git rewind save keep`         | `git reset --soft HEAD~1`                   | Same as above (explicit)                          |
| `git rewind save unstage`      | `git reset --mixed HEAD~1`                  | Undoes last commit, keeps changes unstaged        |
| `git rewind save destroy`      | `git reset --hard HEAD~1`                   | Undoes last commit AND deletes all changes        |
| `git rewind saves 3`           | `git reset --soft HEAD~3`                   | Undoes last 3 commits, keeps changes staged       |
| `git rewind saves 3 destroy`   | `git reset --hard HEAD~3`                   | Undoes last 3 commits AND deletes all changes     |
| `git rewind to abc123`         | `git reset --soft abc123`                   | Rewinds to a commit, keeps changes staged         |
| `git rewind to abc123 destroy` | `git reset --hard abc123`                   | Rewinds to a commit AND deletes all changes       |

### Discarding Changes (Uncommitted)

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `git discard changes`          | `git checkout .`                            | Discards all uncommitted changes in files         |
| `git discard changes file.js`  | `git checkout file.js`                      | Discards changes in one specific file             |
| `git discard all`              | `git reset --hard HEAD`                     | Discards ALL uncommitted changes (staged + unstaged) |

### Stashing (Temporary Storage)

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `git stash`                    | `git stash`                                 | Temporarily stores uncommitted changes            |
| `git stash "message"`          | `git stash save "message"`                  | Stashes with a description                        |
| `git stash apply`              | `git stash apply`                           | Restores stashed changes (keeps stash)            |
| `git stash pop`                | `git stash pop`                             | Restores stashed changes (removes stash)          |
| `git stash drop`               | `git stash drop`                            | Deletes the most recent stash                     |
| `git stash clear`              | `git stash clear`                           | Deletes all stashes                               |

### Branches

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `git switch branch-name`       | `git checkout branch-name`                  | Switches to a different branch                    |
| `git switch -`                 | `git checkout -`                            | Switches to the previous branch                   |
| `git create branch-name`       | `git checkout -b branch-name`               | Creates a new branch and switches to it           |
| `git create branch-name from main` | `git checkout -b branch-name main`      | Creates branch from a specific branch             |
| `git delete branch-name`       | `git branch -d branch-name`                 | Deletes a local branch (safe)                     |
| `git delete branch-name force` | `git branch -D branch-name`                 | Force deletes a local branch                      |
| `git delete remote branch-name`| `git push origin --delete branch-name`      | Deletes a branch from remote                      |
| `git rename branch new-name`   | `git branch -m new-name`                    | Renames the current branch                        |
| `git merge branch-name`        | `git merge branch-name`                     | Combines another branch into current branch       |
| `git merge branch-name squash` | `git merge --squash branch-name`            | Merges as a single commit                         |
| `git rebase main`              | `git rebase main`                           | Replays current branch commits onto main          |
| `git rebase cancel`            | `git rebase --abort`                        | Cancels an in-progress rebase                     |
| `git rebase continue`          | `git rebase --continue`                     | Continues rebase after resolving conflicts        |

### Tags

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `git tag v1.0.0`               | `git tag v1.0.0`                            | Creates a lightweight tag                         |
| `git tag v1.0.0 "message"`     | `git tag -a v1.0.0 -m "message"`            | Creates an annotated tag with message             |
| `git tag v1.0.0 abc123`        | `git tag v1.0.0 abc123`                     | Tags a specific commit                            |
| `git delete tag v1.0.0`        | `git tag -d v1.0.0`                         | Deletes a local tag                               |
| `git delete remote tag v1.0.0` | `git push origin --delete v1.0.0`           | Deletes a tag from remote                         |

### Remote Repositories

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `git download url`             | `git clone url`                             | Downloads a copy of a remote repository           |
| `git download url folder`      | `git clone url folder`                      | Clones into a specific folder                     |
| `git download url shallow`     | `git clone --depth 1 url`                   | Clones only the latest commit (faster)            |
| `git remote add origin url`    | `git remote add origin url`                 | Adds a new remote repository                      |
| `git remote remove origin`     | `git remote remove origin`                  | Removes a remote repository                       |
| `git remote rename origin upstream` | `git remote rename origin upstream`    | Renames a remote                                  |

### Undoing and Fixing

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `git revert abc123`            | `git revert abc123`                         | Creates a new commit that undoes a specific commit|
| `git revert last`              | `git revert HEAD`                           | Reverts the most recent commit                    |
| `git cherry-pick abc123`       | `git cherry-pick abc123`                    | Copies a commit from another branch               |
| `git clean`                    | `git clean -fd`                             | Removes untracked files and directories           |
| `git clean preview`            | `git clean -fd --dry-run`                   | Shows what would be removed (without doing it)    |

### Configuration

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `git config name "Your Name"`  | `git config user.name "Your Name"`          | Sets your name for commits                        |
| `git config email "you@x.com"` | `git config user.email "you@x.com"`         | Sets your email for commits                       |
| `git config list`              | `git config --list`                         | Shows all git configuration                       |

---

## NPM

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `npm setup`                    | `npm install`                               | Installs all project dependencies from package.json |
| `npm add lodash`               | `npm install lodash`                        | Adds a new package to your project                |
| `npm add lodash --dev`         | `npm install lodash --save-dev`             | Adds a package as a dev dependency                |
| `npm remove lodash`            | `npm uninstall lodash`                      | Removes a package from your project               |
| `npm show packages`            | `npm list --depth=0`                        | Shows all installed packages                      |
| `npm show outdated`            | `npm outdated`                              | Shows packages that have newer versions           |
| `npm update`                   | `npm update`                                | Updates all packages to latest allowed versions   |
| `npm run start`                | `npm run start`                             | Starts the application                            |
| `npm run dev`                  | `npm run dev`                               | Starts the application in development mode        |
| `npm run test`                 | `npm test`                                  | Runs the test suite                               |
| `npm run build`                | `npm run build`                             | Builds the application for production             |
| `npm run lint`                 | `npm run lint`                              | Checks code for style and syntax issues           |

---

## GRADLE

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `gradle build`                 | `./gradlew build`                           | Compiles and builds the entire project            |
| `gradle build clean`           | `./gradlew clean build`                     | Clears old files then builds fresh                |
| `gradle build debug`           | `./gradlew assembleDebug`                   | Builds the debug version (Android)                |
| `gradle build release`         | `./gradlew assembleRelease`                 | Builds the release version (Android)              |
| `gradle run`                   | `./gradlew run`                             | Runs the application                              |
| `gradle run boot`              | `./gradlew bootRun`                         | Runs a Spring Boot application                    |
| `gradle test`                  | `./gradlew test`                            | Runs all unit tests                               |
| `gradle test device`           | `./gradlew connectedAndroidTest`            | Runs tests on a connected Android device          |
| `gradle lint`                  | `./gradlew lint`                            | Checks code for potential bugs and style issues   |
| `gradle clean`                 | `./gradlew clean`                           | Deletes all build outputs                         |
| `gradle show tasks`            | `./gradlew tasks`                           | Lists all available gradle tasks                  |
| `gradle show tasks all`        | `./gradlew tasks --all`                     | Lists all tasks including hidden ones             |
| `gradle show dependencies`     | `./gradlew dependencies`                    | Shows the full dependency tree                    |
| `gradle show projects`         | `./gradlew projects`                        | Shows all subprojects in a multi-project build    |
| `gradle install debug`         | `./gradlew installDebug`                    | Installs debug app on connected Android device    |
| `gradle install release`       | `./gradlew installRelease`                  | Installs release app on connected Android device  |
| `gradle uninstall debug`       | `./gradlew uninstallDebug`                  | Removes debug app from connected Android device   |
| `gradle show signing`          | `./gradlew signingReport`                   | Shows signing configuration for Android builds    |

---

## MAVEN

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `maven build`                  | `mvn package`                               | Compiles and packages the project                 |
| `maven build clean`            | `mvn clean package`                         | Clears old files then builds fresh                |
| `maven build skip tests`       | `mvn package -DskipTests`                   | Builds without running tests (faster)             |
| `maven run`                    | `mvn exec:java`                             | Runs the main class                               |
| `maven run boot`               | `mvn spring-boot:run`                       | Runs a Spring Boot application                    |
| `maven test`                   | `mvn test`                                  | Runs all unit tests                               |
| `maven clean`                  | `mvn clean`                                 | Deletes all build outputs                         |
| `maven show dependencies`      | `mvn dependency:tree`                       | Shows the full dependency tree                    |
| `maven show effective pom`     | `mvn help:effective-pom`                    | Shows the resolved pom with all inherited values  |

---

## DOCKER

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `docker show containers`       | `docker ps`                                 | Shows all running containers                      |
| `docker show all containers`   | `docker ps -a`                              | Shows all containers including stopped ones       |
| `docker show images`           | `docker images`                             | Shows all downloaded images                       |
| `docker show logs myapp`       | `docker logs myapp`                         | Shows output logs from a container                |
| `docker show logs myapp follow`| `docker logs -f myapp`                      | Shows logs and keeps following new output         |
| `docker run nginx`             | `docker run nginx`                          | Creates and starts a container from an image      |
| `docker run nginx detach`      | `docker run -d nginx`                       | Runs container in background (detached)           |
| `docker run nginx port 8080:80`| `docker run -p 8080:80 nginx`               | Runs container with port mapping                  |
| `docker start myapp`           | `docker start myapp`                        | Starts a stopped container                        |
| `docker stop myapp`            | `docker stop myapp`                         | Stops a running container                         |
| `docker restart myapp`         | `docker restart myapp`                      | Stops and starts a container                      |
| `docker remove myapp`          | `docker rm myapp`                           | Deletes a stopped container                       |
| `docker remove image nginx`    | `docker rmi nginx`                          | Deletes a downloaded image                        |
| `docker build`                 | `docker build -t myapp .`                   | Builds an image from Dockerfile in current folder |
| `docker build tag myapp:v1`    | `docker build -t myapp:v1 .`                | Builds an image with a specific tag               |
| `docker exec myapp bash`       | `docker exec -it myapp bash`                | Opens a shell inside a running container          |

---

## FILES

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `files find "text"`            | `grep -r "text" .`                          | Searches for text inside all files                |
| `files find "text" in src`     | `grep -r "text" ./src`                      | Searches for text inside a specific folder        |
| `files find name app.js`       | `find . -name "app.js"`                     | Finds files by name                               |
| `files find name "*.js"`       | `find . -name "*.js"`                       | Finds files matching a pattern                    |
| `files show app.js`            | `cat app.js`                                | Displays the contents of a file                   |
| `files show app.js lines 1-20` | `sed -n '1,20p' app.js`                     | Shows specific lines of a file                    |
| `files open app.js`            | `$EDITOR app.js`                            | Opens the file in your default editor             |
| `files count lines app.js`     | `wc -l app.js`                              | Counts the number of lines in a file              |

---

## HELP

| Friendly Command               | What It Does                                                  |
|--------------------------------|---------------------------------------------------------------|
| `help`                         | Shows all available tools and commands                        |
| `help git`                     | Shows all git commands                                        |
| `help npm`                     | Shows all npm commands                                        |
| `help gradle`                  | Shows all gradle commands                                     |
| `help maven`                   | Shows all maven commands                                      |
| `help docker`                  | Shows all docker commands                                     |
| `help files`                   | Shows all files commands                                      |
| `help git save`                | Explains what a specific command does with examples           |
| `friendly`                     | Opens interactive menu for exploring commands                 |
