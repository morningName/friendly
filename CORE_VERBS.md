# Friendly Terminal - Core Verbs

These verbs are consistent across all tools. Learn once, use everywhere.

## Primary Verbs

| Verb      | Meaning                | Example                    |
|-----------|------------------------|----------------------------|
| show      | Display information    | `git show changes`         |
| save      | Commit/snapshot        | `git save "message"`       |
| sync      | Push/pull with remote  | `git sync upload`          |
| rewind    | Undo commits           | `git rewind save`          |
| discard   | Throw away changes     | `git discard changes`      |
| download  | Get from remote        | `git download url`         |
| run       | Execute                | `npm run start`            |
| build     | Compile/assemble       | `gradle build`             |
| test      | Run tests              | `gradle test`              |

## Resource Management Verbs

| Verb      | Meaning                | Example                    |
|-----------|------------------------|----------------------------|
| setup     | Install dependencies   | `npm setup`                |
| add       | Add a package/item     | `npm add lodash`           |
| remove    | Remove something       | `npm remove lodash`        |
| update    | Update packages        | `npm update`               |
| clean     | Clear build outputs    | `gradle clean`             |

## Service/Process Verbs

| Verb      | Meaning                | Example                    |
|-----------|------------------------|----------------------------|
| start     | Start a service        | `docker start myapp`       |
| stop      | Stop a service         | `docker stop myapp`        |
| restart   | Restart a service      | `docker restart myapp`     |

## Branch/Version Verbs

| Verb      | Meaning                | Example                    |
|-----------|------------------------|----------------------------|
| create    | Make new               | `git create branch-name`   |
| delete    | Remove branch/tag      | `git delete branch-name`   |
| switch    | Change to              | `git switch branch-name`   |
| merge     | Combine branches       | `git merge branch-name`    |
| rebase    | Replay commits         | `git rebase main`          |
| tag       | Mark a version         | `git tag v1.0.0`           |

## Staging Verbs (Git)

| Verb      | Meaning                | Example                    |
|-----------|------------------------|----------------------------|
| stage     | Add to staging area    | `git stage file.js`        |
| unstage   | Remove from staging    | `git unstage file.js`      |
| stash     | Temporarily store      | `git stash`                |

## File Verbs

| Verb      | Meaning                | Example                    |
|-----------|------------------------|----------------------------|
| find      | Search                 | `files find "text"`        |
| open      | Open in editor         | `files open app.js`        |

## Device Verbs (Mobile)

| Verb      | Meaning                | Example                    |
|-----------|------------------------|----------------------------|
| install   | Put on device          | `gradle install debug`     |
| uninstall | Remove from device     | `gradle uninstall debug`   |

## Modifier Words

These words modify the main verbs:

| Modifier  | Meaning                | Example                    |
|-----------|------------------------|----------------------------|
| all       | Include everything     | `git show history all`     |
| force     | Override protections   | `git sync upload force`    |
| keep      | Preserve changes       | `git rewind save keep`     |
| destroy   | Delete permanently     | `git rewind save destroy`  |
| unstage   | Keep but unstaged      | `git rewind save unstage`  |
| staged    | Only staged items      | `git show diff staged`     |
| remote    | On remote server       | `git show branches remote` |
| local     | On local machine       | `git show branches local`  |
| follow    | Keep watching          | `docker show logs app follow` |
| detach    | Run in background      | `docker run nginx detach`  |
