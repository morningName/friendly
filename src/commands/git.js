const { execSync } = require('child_process');
const { printCommand, printSuccess, printError } = require('../utils/ascii');
const { printTable } = require('../utils/table');

// Git command mappings
const gitCommands = {
  // Showing Information
  'show changes': { cmd: 'git status', desc: 'Shows which files you have modified' },
  'show diff': { cmd: 'git diff', desc: 'Shows line-by-line changes in your files' },
  'show diff staged': { cmd: 'git diff --staged', desc: 'Shows changes that are staged for commit' },
  'show history': { cmd: 'git log --oneline -10', desc: 'Shows your last 10 commits' },
  'show history all': { cmd: 'git log --oneline', desc: 'Shows full commit history' },
  'show history detailed': { cmd: 'git log', desc: 'Shows commits with full details and messages' },
  'show branches': { cmd: 'git branch -a', desc: 'Shows all local and remote branches' },
  'show branches local': { cmd: 'git branch', desc: 'Shows only local branches' },
  'show branches remote': { cmd: 'git branch -r', desc: 'Shows only remote branches' },
  'show remote': { cmd: 'git remote -v', desc: 'Shows remote repository URLs' },
  'show tags': { cmd: 'git tag', desc: 'Shows all tags' },
  'show drafts': { cmd: 'git stash list', desc: 'Shows all saved drafts (stashed changes)' },

  // Syncing
  'sync upload': { cmd: 'git push', desc: 'Uploads your commits to the remote repository' },
  'sync upload force': { cmd: 'git push --force', desc: 'Force uploads (overwrites remote history)' },
  'sync upload tags': { cmd: 'git push --tags', desc: 'Uploads all tags to remote' },
  'sync download': { cmd: 'git pull', desc: 'Downloads latest changes from remote repository' },
  'sync download rebase': { cmd: 'git pull --rebase', desc: 'Downloads and replays your commits on top' },
  'sync': { cmd: 'git pull && git push', desc: 'Downloads then uploads (full sync)' },
  'fetch': { cmd: 'git fetch', desc: 'Downloads remote changes without merging' },
  'fetch all': { cmd: 'git fetch --all', desc: 'Downloads from all remotes' },

  // Staging
  'add all': { cmd: 'git add .', desc: 'Stages all changed files' },
  'remove all': { cmd: 'git reset HEAD', desc: 'Removes all files from staging area' },

  // Discarding
  'discard changes': { cmd: 'git checkout .', desc: 'Discards all uncommitted changes in files' },
  'discard all': { cmd: 'git reset --hard HEAD', desc: 'Discards ALL uncommitted changes (staged + unstaged)' },

  // Drafts (Stashing) - Save work-in-progress without committing
  'draft': { cmd: 'git stash', desc: 'Saves your uncommitted work as a draft so you can switch tasks' },
  'draft save': { cmd: 'git stash', desc: 'Saves current changes as a draft to work on later' },
  'draft restore': { cmd: 'git stash apply', desc: 'Brings back your draft changes (keeps the draft saved)' },
  'draft restore and delete': { cmd: 'git stash pop', desc: 'Brings back your draft and removes it from drafts' },
  'draft delete': { cmd: 'git stash drop', desc: 'Deletes the most recent draft' },
  'draft delete all': { cmd: 'git stash clear', desc: 'Deletes all saved drafts' },

  // Branch shortcuts
  'switch -': { cmd: 'git checkout -', desc: 'Switches to the previous branch' },

  // Rehome (Rebase) - Move your commits to a new base
  'rehome cancel': { cmd: 'git rebase --abort', desc: 'Cancels rehome and goes back to how things were before' },
  'rehome continue': { cmd: 'git rebase --continue', desc: 'Continues rehome after you fixed the conflicts' },
  'rehome skip': { cmd: 'git rebase --skip', desc: 'Skips the current commit and continues rehome' },

  // Undoing
  'revert last': { cmd: 'git revert HEAD', desc: 'Reverts the most recent commit' },
  'clean': { cmd: 'git clean -fd', desc: 'Removes untracked files and directories' },
  'clean preview': { cmd: 'git clean -fd --dry-run', desc: 'Shows what would be removed (without doing it)' },

  // Config
  'config list': { cmd: 'git config --list', desc: 'Shows all git configuration' },
};

// Commands that need arguments
const gitCommandsWithArgs = {
  'show blame': (file) => ({ cmd: `git blame ${file}`, desc: `Shows who wrote each line of ${file}` }),
  'show commit': (hash) => ({ cmd: `git show ${hash}`, desc: `Shows details of commit ${hash}` }),

  'save': (msg) => ({ cmd: `git add . && git commit -m "${msg}"`, desc: 'Saves all your changes with a description' }),
  'commit': (msg) => ({ cmd: `git add . && git commit -m "${msg}"`, desc: 'Commits all your changes with a description' }),

  'add': (file) => ({ cmd: `git add ${file}`, desc: `Stages ${file} for the next commit` }),
  'remove': (file) => ({ cmd: `git reset HEAD ${file}`, desc: `Removes ${file} from staging area` }),

  'discard': (file) => ({ cmd: `git checkout ${file}`, desc: `Discards changes in ${file}` }),

  'rewind': (args) => parseRewindCommand(args),

  'draft with message': (msg) => ({ cmd: `git stash save "${msg}"`, desc: 'Saves draft with a name so you can find it later' }),

  'switch': (branch) => ({ cmd: `git checkout ${branch}`, desc: `Switches to ${branch} branch` }),
  'create': (branch) => ({ cmd: `git checkout -b ${branch}`, desc: `Creates ${branch} branch and switches to it` }),
  'delete': (branch) => ({ cmd: `git branch -d ${branch}`, desc: `Deletes ${branch} branch (safe)` }),
  'delete force': (branch) => ({ cmd: `git branch -D ${branch}`, desc: `Force deletes ${branch} branch` }),
  'delete remote': (branch) => ({ cmd: `git push origin --delete ${branch}`, desc: `Deletes ${branch} from remote` }),
  'rename branch': (name) => ({ cmd: `git branch -m ${name}`, desc: `Renames current branch to ${name}` }),
  'merge': (branch) => ({ cmd: `git merge ${branch}`, desc: `Merges ${branch} into current branch` }),
  'merge squash': (branch) => ({ cmd: `git merge --squash ${branch}`, desc: `Merges ${branch} as a single commit` }),
  'rehome': (branch) => ({ cmd: `git rebase ${branch}`, desc: `Moves your commits on top of ${branch} (makes history cleaner)` }),
  'rehome onto': (branch) => ({ cmd: `git rebase ${branch}`, desc: `Replays your work on top of ${branch}'s latest changes` }),

  'create tag': (tag) => ({ cmd: `git tag ${tag}`, desc: `Creates a bookmark named ${tag} at current commit` }),
  'delete tag': (tag) => ({ cmd: `git tag -d ${tag}`, desc: `Deletes local tag ${tag}` }),
  'delete remote tag': (tag) => ({ cmd: `git push origin --delete ${tag}`, desc: `Deletes tag ${tag} from remote` }),

  'download': (url) => ({ cmd: `git clone ${url}`, desc: 'Downloads a copy of a remote repository' }),
  'download shallow': (url) => ({ cmd: `git clone --depth 1 ${url}`, desc: 'Clones only the latest commit (faster)' }),

  'remote add': (args) => {
    const [name, url] = args.split(' ');
    return { cmd: `git remote add ${name} ${url}`, desc: `Adds remote ${name}` };
  },
  'remote remove': (name) => ({ cmd: `git remote remove ${name}`, desc: `Removes remote ${name}` }),
  'remote rename': (args) => {
    const [old, newName] = args.split(' ');
    return { cmd: `git remote rename ${old} ${newName}`, desc: `Renames remote ${old} to ${newName}` };
  },

  'revert': (hash) => ({ cmd: `git revert ${hash}`, desc: `Creates a commit that undoes ${hash}` }),
  'cherry-pick': (hash) => ({ cmd: `git cherry-pick ${hash}`, desc: `Copies commit ${hash} to current branch` }),

  'config name': (name) => ({ cmd: `git config user.name "${name}"`, desc: 'Sets your name for commits' }),
  'config email': (email) => ({ cmd: `git config user.email "${email}"`, desc: 'Sets your email for commits' }),
};

function parseRewindCommand(args) {
  const parts = args.trim().split(' ');

  // git rewind 1 commit
  // git rewind 3 commits
  // git rewind 1 commit to staged
  // git rewind 1 commit to files
  // git rewind 1 commit to trash
  // git rewind to abc123
  // git rewind to abc123 destroy

  if (parts[0] === 'to') {
    // git rewind to abc123
    const hash = parts[1];
    const destroy = parts.includes('destroy');
    if (destroy) {
      return { cmd: `git reset --hard ${hash}`, desc: `Rewinds to ${hash} and deletes all changes` };
    }
    return { cmd: `git reset --soft ${hash}`, desc: `Rewinds to ${hash}, keeps changes staged` };
  }

  const count = parseInt(parts[0]) || 1;
  const toIndex = parts.indexOf('to');

  if (toIndex !== -1) {
    const destination = parts[toIndex + 1];
    if (destination === 'staged') {
      return { cmd: `git reset --soft HEAD~${count}`, desc: `Undoes ${count} commit(s), keeps changes staged` };
    } else if (destination === 'files') {
      return { cmd: `git reset --mixed HEAD~${count}`, desc: `Undoes ${count} commit(s), keeps changes in files` };
    } else if (destination === 'trash') {
      return { cmd: `git reset --hard HEAD~${count}`, desc: `Undoes ${count} commit(s) and deletes all changes` };
    }
  }

  // Default: keep changes staged
  return { cmd: `git reset --soft HEAD~${count}`, desc: `Undoes ${count} commit(s), keeps changes staged` };
}

function executeGit(args) {
  const fullCommand = args.join(' ').trim();

  // Check for help
  if (fullCommand === 'help' || fullCommand === '') {
    return printGitHelp();
  }

  if (fullCommand.startsWith('help ')) {
    const topic = fullCommand.replace('help ', '');
    return printGitHelp(topic);
  }

  // Check exact matches first
  if (gitCommands[fullCommand]) {
    const { cmd, desc } = gitCommands[fullCommand];
    return runCommand(cmd);
  }

  // Check commands with arguments
  for (const [pattern, handler] of Object.entries(gitCommandsWithArgs)) {
    if (fullCommand.startsWith(pattern + ' ') || fullCommand === pattern) {
      const arg = fullCommand.slice(pattern.length).trim();
      const { cmd, desc } = handler(arg);
      return runCommand(cmd);
    }
  }

  // Not found - pass through to real git
  printCommand('git ' + fullCommand);
  try {
    const output = execSync('git ' + fullCommand, { encoding: 'utf-8', stdio: 'inherit' });
  } catch (e) {
    // Git already printed the error
  }
}

function runCommand(cmd) {
  printCommand(cmd);
  console.log('');
  try {
    execSync(cmd, { encoding: 'utf-8', stdio: 'inherit' });
    console.log('');
  } catch (e) {
    // Command already printed error
  }
}

function printGitHelp(topic) {
  const helpData = {
    show: {
      title: 'GIT SHOW COMMANDS',
      rows: [
        ['git show changes', 'git status', 'Shows which files you have modified'],
        ['git show diff', 'git diff', 'Shows line-by-line changes in your files'],
        ['git show diff staged', 'git diff --staged', 'Shows changes that are staged for commit'],
        ['git show history', 'git log --oneline -10', 'Shows your last 10 commits'],
        ['git show history all', 'git log --oneline', 'Shows full commit history'],
        ['git show history detailed', 'git log', 'Shows commits with full details and messages'],
        ['git show branches', 'git branch -a', 'Shows all local and remote branches'],
        ['git show branches local', 'git branch', 'Shows only local branches'],
        ['git show branches remote', 'git branch -r', 'Shows only remote branches'],
        ['git show blame <file>', 'git blame <file>', 'Shows who wrote each line of a file'],
        ['git show remote', 'git remote -v', 'Shows remote repository URLs'],
        ['git show tags', 'git tag', 'Shows all tags'],
        ['git show drafts', 'git stash list', 'Shows all saved drafts'],
        ['git show commit <hash>', 'git show <hash>', 'Shows details of a specific commit'],
      ]
    },
    save: {
      title: 'GIT SAVE/COMMIT COMMANDS',
      rows: [
        ['git save "message"', 'git add . && git commit -m "msg"', 'Saves all your changes with a description'],
        ['git commit "message"', 'git add . && git commit -m "msg"', 'Commits all your changes with a description'],
        ['git add <file>', 'git add <file>', 'Stages a file for the next commit'],
        ['git add all', 'git add .', 'Stages all changed files'],
        ['git remove <file>', 'git reset HEAD <file>', 'Removes a file from staging area'],
        ['git remove all', 'git reset HEAD', 'Removes all files from staging area'],
      ]
    },
    sync: {
      title: 'GIT SYNC COMMANDS',
      rows: [
        ['git sync upload', 'git push', 'Uploads your commits to the remote repository'],
        ['git sync upload force', 'git push --force', 'Force uploads (overwrites remote history)'],
        ['git sync upload tags', 'git push --tags', 'Uploads all tags to remote'],
        ['git sync download', 'git pull', 'Downloads latest changes from remote repository'],
        ['git sync download rebase', 'git pull --rebase', 'Downloads and replays your commits on top'],
        ['git sync', 'git pull && git push', 'Downloads then uploads (full sync)'],
        ['git fetch', 'git fetch', 'Downloads remote changes without merging'],
        ['git fetch all', 'git fetch --all', 'Downloads from all remotes'],
      ]
    },
    rewind: {
      title: 'GIT REWIND COMMANDS',
      rows: [
        ['git rewind 1 commit', 'git reset --soft HEAD~1', 'Undoes last commit, keeps changes staged'],
        ['git rewind 3 commits', 'git reset --soft HEAD~3', 'Undoes last 3 commits, keeps changes staged'],
        ['git rewind 1 commit to staged', 'git reset --soft HEAD~1', 'Undoes commit, keeps changes staged'],
        ['git rewind 1 commit to files', 'git reset --mixed HEAD~1', 'Undoes commit, keeps changes in files'],
        ['git rewind 1 commit to trash', 'git reset --hard HEAD~1', 'Undoes commit AND deletes all changes'],
        ['git rewind to <hash>', 'git reset --soft <hash>', 'Rewinds to specific commit, keeps changes'],
        ['git rewind to <hash> destroy', 'git reset --hard <hash>', 'Rewinds to specific commit, deletes changes'],
      ]
    },
    discard: {
      title: 'GIT DISCARD COMMANDS',
      rows: [
        ['git discard <file>', 'git checkout <file>', 'Discards changes in one specific file'],
        ['git discard changes', 'git checkout .', 'Discards all uncommitted changes in files'],
        ['git discard all', 'git reset --hard HEAD', 'Discards ALL uncommitted changes (staged + unstaged)'],
      ]
    },
    draft: {
      title: 'GIT DRAFT COMMANDS (Save Work-in-Progress)',
      rows: [
        ['git draft', 'git stash', 'Saves your uncommitted work as a draft'],
        ['git draft save', 'git stash', 'Saves current changes to work on later'],
        ['git draft with message "WIP"', 'git stash save "WIP"', 'Saves draft with a name to find it later'],
        ['git draft restore', 'git stash apply', 'Brings back draft changes (keeps draft)'],
        ['git draft restore and delete', 'git stash pop', 'Brings back draft and removes it'],
        ['git draft delete', 'git stash drop', 'Deletes the most recent draft'],
        ['git draft delete all', 'git stash clear', 'Deletes all saved drafts'],
        ['git show drafts', 'git stash list', 'Shows all your saved drafts'],
      ]
    },
    branches: {
      title: 'GIT BRANCH COMMANDS',
      rows: [
        ['git switch <branch>', 'git checkout <branch>', 'Switches to a different branch'],
        ['git switch -', 'git checkout -', 'Switches to the previous branch'],
        ['git create <branch>', 'git checkout -b <branch>', 'Creates a new branch and switches to it'],
        ['git delete <branch>', 'git branch -d <branch>', 'Deletes a local branch (safe)'],
        ['git delete <branch> force', 'git branch -D <branch>', 'Force deletes a local branch'],
        ['git delete remote <branch>', 'git push origin --delete <branch>', 'Deletes a branch from remote'],
        ['git rename branch <name>', 'git branch -m <name>', 'Renames the current branch'],
        ['git merge <branch>', 'git merge <branch>', 'Combines another branch into current branch'],
        ['git merge <branch> squash', 'git merge --squash <branch>', 'Merges as a single commit'],
        ['git rehome <branch>', 'git rebase <branch>', 'Moves your commits on top of another branch'],
        ['git rehome cancel', 'git rebase --abort', 'Cancels rehome, goes back to before'],
        ['git rehome continue', 'git rebase --continue', 'Continues after fixing conflicts'],
        ['git rehome skip', 'git rebase --skip', 'Skips current commit, continues rehome'],
      ]
    },
    tags: {
      title: 'GIT TAG COMMANDS (Bookmarks for Versions)',
      rows: [
        ['git create tag <name>', 'git tag <name>', 'Creates a bookmark at current commit'],
        ['git create tag v1.0.0', 'git tag v1.0.0', 'Example: marks this as version 1.0.0'],
        ['git delete tag <name>', 'git tag -d <name>', 'Deletes a local tag'],
        ['git delete remote tag <name>', 'git push origin --delete <name>', 'Deletes a tag from remote'],
        ['git show tags', 'git tag', 'Shows all tags/bookmarks'],
        ['git sync upload tags', 'git push --tags', 'Uploads all tags to remote'],
      ]
    },
    remote: {
      title: 'GIT REMOTE COMMANDS',
      rows: [
        ['git download <url>', 'git clone <url>', 'Downloads a copy of a remote repository'],
        ['git download <url> shallow', 'git clone --depth 1 <url>', 'Clones only the latest commit (faster)'],
        ['git remote add <name> <url>', 'git remote add <name> <url>', 'Adds a new remote repository'],
        ['git remote remove <name>', 'git remote remove <name>', 'Removes a remote repository'],
        ['git remote rename <old> <new>', 'git remote rename <old> <new>', 'Renames a remote'],
        ['git show remote', 'git remote -v', 'Shows remote repository URLs'],
      ]
    },
  };

  const colWidths = [35, 40, 50];
  const headers = ['Friendly Command', 'Actual Command', 'What It Does'];

  if (topic && helpData[topic]) {
    printTable(helpData[topic].title, headers, helpData[topic].rows, colWidths);
    return;
  }

  // Print all
  console.log('');
  printTable('GIT COMMANDS', headers, [
    ['SHOWING INFORMATION', '', ''],
    ...helpData.show.rows,
    ['', '', ''],
    ['SAVING CHANGES', '', ''],
    ...helpData.save.rows,
    ['', '', ''],
    ['SYNCING WITH REMOTE', '', ''],
    ...helpData.sync.rows,
    ['', '', ''],
    ['REWINDING (UNDOING COMMITS)', '', ''],
    ...helpData.rewind.rows,
    ['', '', ''],
    ['DISCARDING CHANGES', '', ''],
    ...helpData.discard.rows,
    ['', '', ''],
    ['DRAFTS (Save Work-in-Progress)', '', ''],
    ...helpData.draft.rows,
    ['', '', ''],
    ['BRANCHES', '', ''],
    ...helpData.branches.rows,
    ['', '', ''],
    ['TAGS', '', ''],
    ...helpData.tags.rows,
    ['', '', ''],
    ['REMOTE REPOSITORIES', '', ''],
    ...helpData.remote.rows,
  ], colWidths);

  console.log('');
  console.log('  Type \'git help <topic>\' for details. Topics: show, save, sync, rewind, discard, draft, branches, tags, remote');
  console.log('');
}

module.exports = {
  executeGit,
  printGitHelp
};
