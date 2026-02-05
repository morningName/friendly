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
| `git show drafts`              | `git stash list`                            | Shows all saved drafts (work-in-progress)         |
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

### Drafts (Save Work-in-Progress)

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `git draft`                    | `git stash`                                 | Saves uncommitted work as a draft                 |
| `git draft save`               | `git stash`                                 | Saves current changes to work on later            |
| `git draft with message "WIP"` | `git stash save "WIP"`                      | Saves draft with a name to find it later          |
| `git draft restore`            | `git stash apply`                           | Brings back draft changes (keeps draft)           |
| `git draft restore and delete` | `git stash pop`                             | Brings back draft and removes it                  |
| `git draft delete`             | `git stash drop`                            | Deletes the most recent draft                     |
| `git draft delete all`         | `git stash clear`                           | Deletes all saved drafts                          |
| `git show drafts`              | `git stash list`                            | Shows all your saved drafts                       |

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
| `git rehome main`              | `git rebase main`                           | Moves your commits on top of main (cleaner history) |
| `git rehome cancel`            | `git rebase --abort`                        | Cancels rehome, goes back to before               |
| `git rehome continue`          | `git rebase --continue`                     | Continues rehome after fixing conflicts           |
| `git rehome skip`              | `git rebase --skip`                         | Skips current commit, continues rehome            |

### Tags (Bookmarks for Versions)

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `git create tag v1.0.0`        | `git tag v1.0.0`                            | Creates a bookmark at current commit              |
| `git create tag v1.0.0 "msg"`  | `git tag -a v1.0.0 -m "msg"`                | Creates annotated tag with message                |
| `git delete tag v1.0.0`        | `git tag -d v1.0.0`                         | Deletes a local tag                               |
| `git delete remote tag v1.0.0` | `git push origin --delete v1.0.0`           | Deletes a tag from remote                         |
| `git show tags`                | `git tag`                                   | Shows all tags/bookmarks                          |
| `git sync upload tags`         | `git push --tags`                           | Uploads all tags to remote                        |

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
| `npm install`                  | `npm install`                               | Installs all project dependencies from package.json |
| `npm install lodash`           | `npm install lodash`                        | Installs a new package to your project            |
| `npm install lodash --dev`     | `npm install lodash --save-dev`             | Installs a package as a dev dependency            |
| `npm uninstall lodash`         | `npm uninstall lodash`                      | Removes a package from your project               |
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

### Viewing

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `docker show containers`       | `docker ps`                                 | Shows all running containers                      |
| `docker show all containers`   | `docker ps -a`                              | Shows all containers including stopped ones       |
| `docker show images`           | `docker images`                             | Shows all downloaded images                       |
| `docker show networks`         | `docker network ls`                         | Shows all Docker networks                         |
| `docker show volumes`          | `docker volume ls`                          | Shows all Docker volumes                          |
| `docker logs myapp`            | `docker logs myapp`                         | Shows output logs from a container                |
| `docker logs myapp follow`     | `docker logs -f myapp`                      | Shows logs and keeps following new output         |

### Connecting to Containers

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `docker terminal myapp`        | `docker exec -it myapp bash`                | Opens terminal inside container                   |
| `docker connect myapp`         | `docker exec -it myapp bash`                | Connects interactively to container               |
| `docker shell myapp`           | `docker exec -it myapp bash`                | Opens shell inside container                      |
| `docker enter myapp`           | `docker exec -it myapp bash`                | Enters container with shell                       |
| `docker exec myapp <cmd>`      | `docker exec -it myapp <cmd>`               | Runs command inside container                     |

### Running Containers

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `docker run nginx`             | `docker run nginx`                          | Creates and starts a container from an image      |
| `docker run nginx detach`      | `docker run -d nginx`                       | Runs container in background (detached)           |
| `docker run nginx interactive` | `docker run -it nginx`                      | Runs interactively with terminal                  |
| `docker run nginx port 8080:80`| `docker run -p 8080:80 nginx`               | Runs container with port mapping                  |
| `docker run nginx name myapp`  | `docker run --name myapp nginx`             | Runs with custom name                             |

### Container Lifecycle

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `docker start myapp`           | `docker start myapp`                        | Starts a stopped container                        |
| `docker stop myapp`            | `docker stop myapp`                         | Gracefully stops a container                      |
| `docker kill myapp`            | `docker kill myapp`                         | Force stops a container immediately               |
| `docker restart myapp`         | `docker restart myapp`                      | Restarts a container                              |
| `docker pause myapp`           | `docker pause myapp`                        | Freezes container processes                       |
| `docker resume myapp`          | `docker unpause myapp`                      | Unfreezes paused container                        |

### Removing

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `docker remove myapp`          | `docker rm myapp`                           | Deletes a stopped container                       |
| `docker remove image nginx`    | `docker rmi nginx`                          | Deletes an image                                  |
| `docker remove volume myvol`   | `docker volume rm myvol`                    | Deletes a volume                                  |
| `docker cleanup`               | `docker system prune -f`                    | Removes unused stuff                              |
| `docker cleanup all`           | `docker system prune -a -f`                 | Removes everything unused                         |

### Building & Images

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `docker build`                 | `docker build -t myapp .`                   | Builds an image from Dockerfile                   |
| `docker build tag myapp:v1`    | `docker build -t myapp:v1 .`                | Builds an image with a specific tag               |
| `docker pull nginx`            | `docker pull nginx`                         | Downloads image from registry                     |
| `docker push myapp`            | `docker push myapp`                         | Uploads image to registry                         |

### Inspecting

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `docker inspect myapp`         | `docker inspect myapp`                      | Shows detailed JSON info                          |
| `docker ip myapp`              | `docker inspect -f ...`                     | Shows container IP address                        |
| `docker ports myapp`           | `docker port myapp`                         | Shows port mappings                               |
| `docker top myapp`             | `docker top myapp`                          | Shows running processes                           |
| `docker stats myapp`           | `docker stats myapp`                        | Shows CPU/memory usage                            |

### Docker Compose

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `docker compose up`            | `docker-compose up`                         | Starts all services                               |
| `docker compose up detach`     | `docker-compose up -d`                      | Starts services in background                     |
| `docker compose up build`      | `docker-compose up --build`                 | Rebuilds and starts services                      |
| `docker compose down`          | `docker-compose down`                       | Stops and removes services                        |
| `docker compose logs`          | `docker-compose logs`                       | Shows all service logs                            |
| `docker compose logs follow`   | `docker-compose logs -f`                    | Follows all logs live                             |
| `docker compose ps`            | `docker-compose ps`                         | Shows service status                              |
| `docker compose restart`       | `docker-compose restart`                    | Restarts all services                             |

---

## JAVA

### Compiling

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `java compile MyFile.java`     | `javac MyFile.java`                         | Compiles a single Java file                       |
| `java compile *.java`          | `javac *.java`                              | Compiles all Java files in directory              |
| `java compile to build/ App.java` | `javac -d build/ App.java`               | Compiles to output directory                      |
| `java compile with cp lib/* App.java` | `javac -cp lib/* App.java`            | Compiles with classpath                           |

### Running

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `java run MyClass`             | `java MyClass`                              | Runs a compiled class                             |
| `java run with cp lib/* MyClass` | `java -cp lib/* MyClass`                  | Runs with classpath                               |
| `java run jar myapp.jar`       | `java -jar myapp.jar`                       | Runs a JAR file                                   |
| `java run with memory 512m MyClass` | `java -Xmx512m MyClass`                | Runs with max memory limit                        |

### JAR Operations

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `java create jar app.jar *.class` | `jar cvf app.jar *.class`                | Creates a JAR archive                             |
| `java create jar with manifest MANIFEST.MF app.jar *.class` | `jar cvfm app.jar MANIFEST.MF *.class` | Creates JAR with manifest |
| `java extract jar app.jar`     | `jar xvf app.jar`                           | Extracts JAR contents                             |
| `java show jar app.jar`        | `jar tvf app.jar`                           | Lists files inside JAR                            |
| `java show jar manifest app.jar` | `unzip -p app.jar META-INF/MANIFEST.MF`   | Shows the manifest file                           |

### Version & Paths

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `java show runtime version`    | `java -version`                             | Shows Java runtime version                        |
| `java show compiler version`   | `javac -version`                            | Shows Java compiler version                       |
| `java show installation path`  | `echo $JAVA_HOME`                           | Shows Java installation path                      |
| `java show classpath`          | `echo $CLASSPATH`                           | Shows current classpath                           |

### Finding Files

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `java find class MyClass`      | `find . -name "MyClass.class"`              | Finds compiled .class file                        |
| `java find source MyClass`     | `find . -name "MyClass.java"`               | Finds Java source file                            |

---

## SHELL (Scripting)

### Script Execution

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `shell make executable script.sh` | `chmod +x script.sh`                     | Makes script executable                           |
| `shell run script myscript.sh` | `bash myscript.sh`                          | Runs a shell script                               |
| `shell run in background <cmd>` | `<cmd> &`                                  | Runs command in background                        |
| `shell run silent <cmd>`       | `<cmd> > /dev/null 2>&1`                    | Runs without output                               |
| `shell run and log out.txt <cmd>` | `<cmd> 2>&1 \| tee out.txt`              | Runs and logs output                              |

### Environment

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `shell show my shell`          | `echo $SHELL`                               | Shows your current shell                          |
| `shell show environment`       | `printenv`                                  | Shows all env variables                           |
| `shell show path`              | `echo $PATH \| tr ":" "\n"`                 | Shows PATH (one per line)                         |
| `shell show variable HOME`     | `echo $HOME`                                | Shows variable value                              |
| `shell set variable NAME value` | `export NAME="value"`                      | Sets environment variable                         |
| `shell add to path /my/dir`    | `export PATH="$PATH:/my/dir"`               | Adds directory to PATH                            |

### Aliases

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `shell show aliases`           | `alias`                                     | Lists all aliases                                 |
| `shell create alias ll ls -la` | `alias ll='ls -la'`                         | Creates a shortcut                                |
| `shell remove alias ll`        | `unalias ll`                                | Removes an alias                                  |

### Shell Config

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `shell edit bashrc`            | `nano ~/.bashrc`                            | Edit bash configuration                           |
| `shell edit zshrc`             | `nano ~/.zshrc`                             | Edit zsh configuration                            |
| `shell reload shell`           | `exec $SHELL`                               | Reloads shell config                              |

### Cron Jobs (Scheduled Tasks)

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `shell show cron jobs`         | `crontab -l`                                | Lists scheduled tasks                             |
| `shell edit cron jobs`         | `crontab -e`                                | Edit scheduled tasks                              |

### Utilities

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `shell watch command <cmd>`    | `watch -n 2 <cmd>`                          | Repeats every 2 seconds                           |
| `shell repeat 5 echo hello`    | `for i in...; do...; done`                  | Repeats command N times                           |
| `shell show history`           | `history \| tail -50`                       | Shows recent commands                             |

### Output Redirection

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `shell save output to file.txt <cmd>` | `<cmd> > file.txt`                    | Saves output to file                              |
| `shell append output to file.txt <cmd>` | `<cmd> >> file.txt`                 | Appends to file                                   |

---

## SERVER (Nginx / Apache / SSL)

### Nginx - Basic

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `server nginx status`          | `systemctl status nginx`                    | Shows nginx status                                |
| `server nginx start`           | `systemctl start nginx`                     | Starts nginx                                      |
| `server nginx stop`            | `systemctl stop nginx`                      | Stops nginx                                       |
| `server nginx restart`         | `systemctl restart nginx`                   | Restarts nginx                                    |
| `server nginx reload`          | `systemctl reload nginx`                    | Reloads config (no downtime)                      |
| `server nginx test config`     | `nginx -t`                                  | Tests configuration                               |

### Nginx - Sites

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `server nginx show sites`      | `ls /etc/nginx/sites-enabled/`              | Lists enabled sites                               |
| `server nginx enable site mysite` | `ln -s sites-available/... sites-enabled/` | Enables a site                                   |
| `server nginx disable site mysite` | `rm /etc/nginx/sites-enabled/mysite`     | Disables a site                                   |
| `server nginx edit site mysite` | `nano /etc/nginx/sites-available/mysite`   | Edit site config                                  |
| `server nginx create site mysite` | `cp default sites-available/mysite`       | Creates from template                             |

### Nginx - Reverse Proxy

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `server nginx proxy domain.com 3000` | Creates config file                      | Sets up reverse proxy to localhost:3000           |

### Nginx - Logs

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `server nginx show logs`       | `tail -f /var/log/nginx/access.log`         | Shows access logs (live)                          |
| `server nginx show errors`     | `tail -f /var/log/nginx/error.log`          | Shows error logs (live)                           |

### Apache - Basic

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `server apache status`         | `systemctl status apache2`                  | Shows Apache status                               |
| `server apache start`          | `systemctl start apache2`                   | Starts Apache                                     |
| `server apache stop`           | `systemctl stop apache2`                    | Stops Apache                                      |
| `server apache restart`        | `systemctl restart apache2`                 | Restarts Apache                                   |
| `server apache test config`    | `apachectl configtest`                      | Tests configuration                               |

### Apache - Sites & Modules

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `server apache enable site mysite` | `a2ensite mysite`                        | Enables a site                                    |
| `server apache disable site mysite` | `a2dissite mysite`                      | Disables a site                                   |
| `server apache enable module ssl` | `a2enmod ssl`                             | Enables a module                                  |
| `server apache show modules`   | `apache2ctl -M`                             | Lists loaded modules                              |

### SSL/HTTPS (Certbot)

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `server ssl show certificates` | `certbot certificates`                      | Lists all certificates                            |
| `server ssl get certificate domain.com` | `certbot --nginx -d domain.com`      | Gets SSL cert (nginx)                             |
| `server ssl get certificate apache domain.com` | `certbot --apache -d domain.com` | Gets SSL cert (apache)                            |
| `server ssl renew all`         | `certbot renew`                             | Renews all certificates                           |
| `server ssl renew dry run`     | `certbot renew --dry-run`                   | Tests renewal                                     |
| `server ssl show expiry`       | `certbot certificates`                      | Shows expiry dates                                |

### Ports & Connections

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `server show open ports`       | `netstat -tlnp`                             | Shows listening ports                             |
| `server show port 3000`        | `lsof -i :3000`                             | Shows what uses port                              |
| `server kill port 3000`        | `fuser -k 3000/tcp`                         | Kills process on port                             |
| `server show connections`      | `netstat -anp`                              | Shows active connections                          |

---

## SYSTEM (Linux Administration)

### System Info

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `system show system info`      | `hostnamectl`                               | Shows OS and system info                          |
| `system show uptime`           | `uptime -p`                                 | Shows how long running                            |
| `system show memory`           | `free -h`                                   | Shows RAM usage                                   |
| `system show disk`             | `df -h`                                     | Shows disk space                                  |
| `system show disk usage`       | `du -sh * \| sort -hr`                      | Shows folder sizes                                |
| `system show cpu`              | `lscpu`                                     | Shows CPU info                                    |
| `system show ip`               | `ip addr show`                              | Shows IP addresses                                |
| `system show public ip`        | `curl ifconfig.me`                          | Shows public IP                                   |

### Packages (APT)

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `system update packages`       | `apt update`                                | Updates package list                              |
| `system upgrade packages`      | `apt upgrade -y`                            | Upgrades all packages                             |
| `system update and upgrade`    | `apt update && apt upgrade -y`              | Updates and upgrades all                          |
| `system install nginx`         | `apt install -y nginx`                      | Installs a package                                |
| `system remove nginx`          | `apt remove -y nginx`                       | Removes a package                                 |
| `system search package node`   | `apt search node`                           | Searches for packages                             |
| `system show installed`        | `apt list --installed`                      | Lists installed packages                          |
| `system clean packages`        | `apt autoremove && apt autoclean`           | Removes unused                                    |

### Services (systemctl)

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `system show services`         | `systemctl list-units --type=service`       | Lists running services                            |
| `system service status nginx`  | `systemctl status nginx`                    | Shows service status                              |
| `system service start nginx`   | `systemctl start nginx`                     | Starts a service                                  |
| `system service stop nginx`    | `systemctl stop nginx`                      | Stops a service                                   |
| `system service restart nginx` | `systemctl restart nginx`                   | Restarts a service                                |
| `system service enable nginx`  | `systemctl enable nginx`                    | Enables on boot                                   |
| `system service disable nginx` | `systemctl disable nginx`                   | Disables on boot                                  |
| `system service logs nginx`    | `journalctl -u nginx -f`                    | Shows logs (live)                                 |

### Firewall (UFW)

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `system firewall status`       | `ufw status verbose`                        | Shows firewall status                             |
| `system firewall enable`       | `ufw enable`                                | Enables firewall                                  |
| `system firewall disable`      | `ufw disable`                               | Disables firewall                                 |
| `system firewall allow 80`     | `ufw allow 80`                              | Allows port 80                                    |
| `system firewall allow 443`    | `ufw allow 443`                             | Allows HTTPS                                      |
| `system firewall deny 23`      | `ufw deny 23`                               | Denies port 23                                    |
| `system firewall allow from 1.2.3.4` | `ufw allow from 1.2.3.4`              | Allows IP                                         |
| `system firewall show rules`   | `ufw status numbered`                       | Shows numbered rules                              |
| `system firewall delete rule 3` | `ufw delete 3`                             | Deletes rule #3                                   |

### User Management

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `system show users`            | `who`                                       | Shows logged in users                             |
| `system show all users`        | `cat /etc/passwd \| cut -d: -f1`            | Lists all system users                            |
| `system create user john`      | `adduser john`                              | Creates new user                                  |
| `system delete user john`      | `deluser john`                              | Deletes user                                      |
| `system add to sudo john`      | `usermod -aG sudo john`                     | Gives sudo access                                 |
| `system add to group john docker` | `usermod -aG docker john`                | Adds to group                                     |
| `system show sudo users`       | `getent group sudo`                         | Lists sudo users                                  |

### Processes

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `system show processes`        | `ps aux`                                    | Shows all processes                               |
| `system show top processes`    | `ps aux --sort=-%mem`                       | Top memory users                                  |
| `system find process nginx`    | `ps aux \| grep nginx`                      | Finds processes                                   |
| `system kill process 1234`     | `kill 1234`                                 | Kills by PID                                      |
| `system kill by name nginx`    | `pkill nginx`                               | Kills by name                                     |

### Logs

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `system show system logs`      | `journalctl -xe`                            | Recent system logs                                |
| `system show boot logs`        | `journalctl -b`                             | Boot logs                                         |
| `system show auth logs`        | `tail /var/log/auth.log`                    | Auth/login logs                                   |
| `system show ssh attempts`     | `grep 'Failed password' auth.log`           | Failed SSH logins                                 |
| `system show last logins`      | `last -20`                                  | Recent logins                                     |

### Network

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `system test connection google.com` | `ping -c 4 google.com`                 | Pings host                                        |
| `system trace route google.com` | `traceroute google.com`                    | Traces route                                      |
| `system check port host.com 443` | `nc -zv host.com 443`                     | Checks if port open                               |
| `system show dns`              | `cat /etc/resolv.conf`                      | Shows DNS servers                                 |
| `system show routing`          | `ip route`                                  | Shows routing table                               |

### Permissions

| Friendly Command               | Actual Command                              | What It Does                                      |
|--------------------------------|---------------------------------------------|---------------------------------------------------|
| `system make owner john /var/www` | `chown john:john /var/www`               | Changes owner                                     |
| `system make executable script.sh` | `chmod +x script.sh`                     | Makes executable                                  |
| `system make readable file`    | `chmod +r file`                             | Adds read permission                              |
| `system make writable file`    | `chmod +w file`                             | Adds write permission                             |

---

## FILES (Cross-Platform)

| Friendly Command               | Unix (Mac/Linux)            | Windows                     | What It Does                      |
|--------------------------------|-----------------------------|-----------------------------|-----------------------------------|
| **LISTING FILES** | | | |
| `files list`                   | `ls`                        | `dir`                       | Shows files in folder             |
| `files list all`               | `ls -la`                    | `dir /a`                    | Shows all files + hidden          |
| `files list detailed`          | `ls -lh`                    | `dir`                       | Shows files with sizes            |
| `files list tree`              | `find . -type d`            | `tree`                      | Shows folder structure            |
| | | | |
| **NAVIGATION** | | | |
| `files go to <folder>`         | `cd <folder>`               | `cd <folder>`               | Enter a folder                    |
| `files go back`                | `cd ..`                     | `cd ..`                     | Go to parent folder               |
| `files go home`                | `cd ~`                      | `cd %USERPROFILE%`          | Go to home directory              |
| `files where am i`             | `pwd`                       | `cd`                        | Shows current location            |
| | | | |
| **SEARCHING** | | | |
| `files find text "hello"`      | `grep -r "hello" .`         | `findstr /s "hello"`        | Search text in files              |
| `files find file app.js`       | `find . -name "app.js"`     | `dir /s /b "app.js"`        | Find file by name                 |
| `files find files with ext js` | `find . -name "*.js"`       | `dir /s /b *.js`            | Find by extension                 |
| | | | |
| **VIEWING FILES** | | | |
| `files show app.js`            | `cat app.js`                | `type app.js`               | Display file contents             |
| `files show first 20 app.js`   | `head -n 20 app.js`         | `Get-Content -Head 20`      | Show first N lines                |
| `files show last 20 app.js`    | `tail -n 20 app.js`         | `Get-Content -Tail 20`      | Show last N lines                 |
| `files show lines 1-20 app.js` | `sed -n '1,20p' app.js`     | `Select-Object -Skip...`    | Shows specific lines              |
| `files watch log.txt`          | `tail -f log.txt`           | `Get-Content -Wait`         | Watch file for changes            |
| | | | |
| **COUNTING** | | | |
| `files count lines app.js`     | `wc -l app.js`              | `find /c /v ""`             | Count lines in file               |
| `files count files`            | `find . \| wc -l`           | `dir /s /b \| find /c`      | Count all files                   |
| | | | |
| **FILE OPERATIONS** | | | |
| `files create file app.js`     | `touch app.js`              | `type nul > app.js`         | Create empty file                 |
| `files create folder src`      | `mkdir -p src`              | `mkdir src`                 | Create new folder                 |
| `files copy a.txt b.txt`       | `cp -r a.txt b.txt`         | `xcopy /s /e`               | Copy file or folder               |
| `files move a.txt folder/`     | `mv a.txt folder/`          | `move a.txt folder/`        | Move or rename                    |
| `files delete file app.js`     | `rm app.js`                 | `del app.js`                | Delete a file                     |
| `files delete folder src`      | `rm -rf src`                | `rmdir /s /q src`           | Delete folder + contents          |
| | | | |
| **PERMISSIONS** | | | |
| `files make executable run.sh` | `chmod +x run.sh`           | (N/A on Windows)            | Make script runnable              |
| `files show permissions file`  | `ls -la file`               | `icacls file`               | View file permissions             |
| | | | |
| **TEXT PROCESSING** | | | |
| `files replace old new file`   | `sed -i 's/old/new/g'`      | `PowerShell -replace`       | Find and replace text             |
| `files sort names.txt`         | `sort names.txt`            | `sort names.txt`            | Sort lines A-Z                    |
| `files filter "err" log.txt`   | `grep "err" log.txt`        | `findstr "err" log.txt`     | Filter matching lines             |
| | | | |
| **COMPRESSION** | | | |
| `files zip out.zip folder/`    | `zip -r out.zip folder/`    | `Compress-Archive`          | Create zip archive                |
| `files unzip archive.zip`      | `unzip archive.zip`         | `Expand-Archive`            | Extract zip archive               |
| `files tar create backup.tar.gz` | `tar -czvf backup.tar.gz` | `tar -czvf`                 | Create tar.gz archive             |
| `files tar extract backup.tar.gz` | `tar -xzvf backup.tar.gz` | `tar -xzvf`                | Extract tar.gz archive            |
| | | | |
| **DOWNLOAD** | | | |
| `files download <url>`         | `curl -O <url>`             | `Invoke-WebRequest`         | Download file from URL            |
| | | | |
| **PROCESSES** | | | |
| `files show processes`         | `ps aux`                    | `tasklist`                  | List running programs             |
| `files find process node`      | `ps aux \| grep node`       | `tasklist \| findstr node`  | Find specific process             |
| `files kill 1234`              | `kill 1234`                 | `taskkill /PID 1234`        | Stop process by ID                |
| `files kill by name node`      | `pkill node`                | `taskkill /IM node /F`      | Stop process by name              |
| | | | |
| **NETWORK** | | | |
| `files show ip`                | `ifconfig` / `ip addr`      | `ipconfig`                  | Show IP addresses                 |
| `files show ports`             | `netstat -tuln`             | `netstat -an`               | Show open ports                   |
| `files test connection`        | `ping -c 4 google.com`      | `ping google.com`           | Test internet connection          |
| | | | |
| **SYSTEM** | | | |
| `files show env`               | `env`                       | `set`                       | Show environment vars             |
| `files show path`              | `echo $PATH`                | `echo %PATH%`               | Show PATH variable                |
| `files clear`                  | `clear`                     | `cls`                       | Clear the screen                  |

---

## CUSTOM COMMANDS

Create your own shortcuts for commands you use frequently.

### Creating Custom Commands

| Command                        | What It Does                                                  |
|--------------------------------|---------------------------------------------------------------|
| `friendly custom <pkg> "<cmd>" : "<actual>"` | Creates a custom command                        |
| `friendly custom list`         | Lists all your custom commands                                |
| `friendly custom remove <pkg> "<cmd>"` | Removes a custom command                              |
| `friendly custom edit`         | Opens the config file directly                                |
| `friendly custom clear`        | Removes all custom commands                                   |

### Examples

```bash
# Create a new package with shortcuts
friendly custom deploy "push" : "git push origin main && npm run build"
# Now use: friendly deploy push

# Extend existing tools
friendly custom npm "quick test" : "npm run test -- --watch"
# Now use: friendly npm quick test

# Create git shortcuts
friendly custom git "yolo" : "git add . && git commit -m 'update' && git push"
# Now use: friendly git yolo
```

Custom commands are stored in `~/.friendly-terminal/custom-commands.json` and are checked **before** built-in commands, so you can override existing ones.

---

## HELP

| Friendly Command               | What It Does                                                  |
|--------------------------------|---------------------------------------------------------------|
| `friendly help`                | Shows all available tools and commands                        |
| `git help`                     | Shows all git commands                                        |
| `npm help`                     | Shows all npm commands                                        |
| `docker help`                  | Shows all docker commands                                     |
| `gradle help`                  | Shows all gradle commands                                     |
| `maven help`                   | Shows all maven commands                                      |
| `java help`                    | Shows all java commands                                       |
| `files help`                   | Shows all files commands                                      |
| `shell help`                   | Shows all shell scripting commands                            |
| `server help`                  | Shows all server (nginx/apache/ssl) commands                  |
| `system help`                  | Shows all Linux system administration commands                |
| `friendly learn`               | Interactive command browser                                   |
| `friendly learn all`           | Shows all commands from all tools                             |
| `friendly learn git`           | Shows all git commands in table format                        |
| `friendly tour`                | Takes you through an interactive tour                         |
