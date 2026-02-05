<p align="center">
  <img src="https://raw.githubusercontent.com/friendly-terminal/friendly-terminal/main/assets/logo.png" alt="Friendly Terminal" width="400">
</p>

<h1 align="center">Friendly Terminal</h1>

<p align="center">
  <strong>Human-readable commands for your terminal.</strong><br>
  Stop memorizing cryptic syntax. Start typing what you mean.
</p>

<p align="center">
  <a href="#installation">Installation</a> •
  <a href="#features">Features</a> •
  <a href="#supported-tools">Supported Tools</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/friendly-terminal">
    <img src="https://img.shields.io/npm/v/friendly-terminal.svg?style=flat-square" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/friendly-terminal">
    <img src="https://img.shields.io/npm/dm/friendly-terminal.svg?style=flat-square" alt="npm downloads">
  </a>
  <a href="https://github.com/friendly-terminal/friendly-terminal/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="license">
  </a>
  <a href="https://github.com/friendly-terminal/friendly-terminal/stargazers">
    <img src="https://img.shields.io/github/stars/friendly-terminal/friendly-terminal?style=flat-square" alt="stars">
  </a>
</p>

<br>

<p align="center">
  <img src="https://raw.githubusercontent.com/friendly-terminal/friendly-terminal/main/assets/demo.gif" alt="Demo" width="600">
</p>

---

## The Problem

Terminal commands are hard to remember. Look at these:

```
  git reset --soft HEAD~1
  ^ What does this do? Who knows!

  docker ps -a
  ^ What is "ps"? What is "-a"?

  npm install --save-dev
  ^ So many flags to remember...
```

You end up googling the same commands over and over.

---

## The Solution

What if you could just type what you want to do?

```
  git rewind 1 commit
  ^ Undo my last commit. Makes sense!

  docker terminal myapp
  ^ Open a terminal in my container. Easy!

  npm install lodash --dev
  ^ Install lodash as a dev dependency. Clear!
```

That's what Friendly Terminal does.
**You type readable commands, we translate them for you.**

---

## You Still Learn the Real Commands

Here's the cool part. Every time you run a command,
we show you what's actually happening:

```
  $ git save "fixed the bug"
    Running: git add . && git commit -m "fixed the bug"
    ✓ Saved 3 files
```

See that "Running:" line? That's the real command.
Over time, you'll start recognizing them.

**Friendly Terminal is a learning tool, not a crutch.**

---

## Installation

```bash
# Install globally
npm install -g friendly-terminal

# Run setup to add commands to your shell
friendly setup

# Restart your terminal, then take the tour!
friendly tour
```

**Requirements:**
- Node.js 14 or higher
- npm 6 or higher
- Bash, Zsh, or PowerShell

---

## Features

### 1. Friendly Commands

Type readable commands. We translate them and show you what's running:

```
  $ git save "fixed the login bug"

    Running: git add . && git commit -m "fixed the login bug"
    ✓ Saved 3 files
```

See that `Running:` line? That's the real command. **You learn while you use it.**

**More examples:**

```bash
# Git
git show changes              # → git status
git save "message"            # → git add . && git commit -m "message"
git sync upload               # → git push
git draft                     # → git stash (save work-in-progress)
git rehome main               # → git rebase main
git create tag v1.0.0         # → git tag v1.0.0

# NPM
npm install                   # → npm install (all dependencies)
npm install lodash            # → npm install lodash
npm install jest --dev        # → npm install jest --save-dev

# Docker
docker show containers        # → docker ps
docker terminal myapp         # → docker exec -it myapp bash
docker connect myapp          # → docker exec -it myapp bash
docker compose up detach      # → docker-compose up -d
```

---

### 2. Learn Mode — Your Built-in Cheat Sheet

Maybe you don't want to use friendly commands.
Maybe you just want to see what commands exist.

**That's totally fine!**

Learn mode is like a cheat sheet built into your terminal.
Run it, look up the traditional command, and use that directly.

```bash
friendly learn            # See all tools
friendly learn git        # Browse git commands
friendly learn all        # See everything
```

It shows you nice tables with:
- The friendly command
- The traditional command
- What it does

```
  ┌─────────────────────┬─────────────────────┬──────────────┐
  │ Friendly Command    │ Actual Command      │ What It Does │
  ├─────────────────────┼─────────────────────┼──────────────┤
  │ git show changes    │ git status          │ Show changes │
  │ git sync upload     │ git push            │ Upload code  │
  └─────────────────────┴─────────────────────┴──────────────┘
```

Now you know: "git status" shows changes.
Use "git status" directly if you prefer!

**No setup required** — use `friendly learn` even without running `friendly setup`.

---

### 3. Switch Modes Anytime

You can switch modes anytime. No need to uninstall.

**Friendly Mode** (what you have after setup)
- "git show changes" becomes "git status"
- Commands are translated for you

**Traditional Mode**
- "git status" stays "git status"
- Commands pass through unchanged
- Help and learn still work!

To switch:

```
  friendly mode              See current mode
  friendly mode traditional  Switch to traditional
  friendly mode friendly     Switch back to friendly
```

**Why switch to traditional?**
- Working on someone else's computer
- Pair programming with someone who prefers traditional
- Practicing for a job interview
- You just want the cheat sheet, not the translations

---

### 4. Built-in Help Everywhere

Every tool has help showing all available commands:

```bash
git help              # All git commands
npm help              # All npm commands
docker help           # All docker commands
gradle help           # All gradle commands
```

---

### 5. Interactive Tour

New here? Take a guided tour:

```bash
friendly tour         # Full tour (~2 minutes)
friendly tour quick   # Quick summary
```

---

## Supported Tools

Friendly Terminal works with these tools:

| Tool | Description | Example |
|------|-------------|---------|
| **git** | Version control — track changes, collaborate | `git show changes`, `git save "msg"` |
| **npm** | Node.js packages — install libraries, run scripts | `npm install`, `npm install lodash` |
| **java** | Java development — compile, run, JAR, classpath | `java compile App.java`, `java run App` |
| **gradle** | Java/Android builds — build and run apps | `gradle build`, `gradle run` |
| **maven** | Java builds — another way to build Java projects | `maven build`, `maven test` |
| **docker** | Containers — run apps in isolated environments | `docker terminal myapp`, `docker compose up` |
| **files** | File operations — search and view files | `files find text "hello"`, `files list` |

**Linux/Server Tools:**

| Tool | Description | Example |
|------|-------------|---------|
| **shell** | Shell scripting — environment, cron, aliases | `shell show path`, `shell edit bashrc` |
| **server** | Web servers — nginx, apache, SSL, reverse proxy | `server nginx status`, `server ssl get certificate` |
| **system** | Linux admin — apt, systemctl, firewall, users | `system install nginx`, `system firewall allow 80` |

---

## Quick Examples

**Daily Git Workflow:**

```bash
# Morning: get latest code
git sync download

# Check what you changed
git show changes

# Save your work
git save "added user authentication"

# Upload to team
git sync upload
```

**Oops, Made a Mistake:**

```bash
# Undo last commit (keep files)
git rewind 1 commit

# Undo last 3 commits
git rewind 3 commits

# Throw away all uncommitted changes
git discard all
```

**Working with Branches:**

```bash
# See all branches
git show branches

# Create new branch
git create my-feature

# Switch branches
git switch main

# Merge branch
git merge my-feature
```

**NPM Workflow:**

```bash
# Install dependencies
npm install

# Add packages
npm install axios
npm install jest --dev

# Run scripts
npm run start
npm run test
```

---

## Custom Commands — Create Your Own Shortcuts

Don't see a command you need? Create your own!

```bash
friendly custom <package> "<friendly command>" : "<actual command>"
```

**Examples:**

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

**Managing Custom Commands:**

```bash
friendly custom list                    # See all custom commands
friendly custom remove <pkg> "<cmd>"    # Remove a command
friendly custom edit                    # Edit config file directly
friendly custom clear                   # Remove all custom commands
```

Custom commands are checked **before** built-in commands, so you can even override existing ones!

---

## Architecture

```
friendly-terminal/
├── bin/
│   └── friendly.js           # CLI entry point
│
├── src/
│   ├── commands/             # Tool implementations
│   │   ├── git.js            #   Git commands (50+ commands)
│   │   ├── npm.js            #   NPM commands
│   │   ├── java.js           #   Java compile, run, JAR commands
│   │   ├── docker.js         #   Docker commands (60+ commands)
│   │   ├── gradle.js         #   Gradle commands
│   │   ├── maven.js          #   Maven commands
│   │   ├── files.js          #   File operations (cross-platform)
│   │   ├── shell.js          #   Shell scripting commands
│   │   ├── server.js         #   Nginx, Apache, SSL commands
│   │   └── system.js         #   Linux system admin commands
│   │
│   ├── utils/
│   │   ├── ascii.js          #   Logo, messages
│   │   └── table.js          #   Table formatting
│   │
│   ├── index.js              # Main router
│   ├── setup.js              # Shell integration
│   ├── mode.js               # Mode switching
│   ├── tour.js               # Interactive tour
│   └── custom.js             # Custom commands feature
│
├── COMMANDS.md               # Full command reference
└── CORE_VERBS.md             # Verb consistency guide
```

### How It Works

1. **User types** a friendly command (e.g., `git show changes`)
2. **Shell wrapper** intercepts it and calls `friendly git show changes`
3. **Command parser** looks up the translation (`git status`)
4. **Executor** runs the real command and shows output
5. **User sees** both the translation and the result

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  User types     │ →   │  Friendly       │ →   │  Real command   │
│  git show       │     │  translates to  │     │  git status     │
│  changes        │     │  git status     │     │  runs           │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [COMMANDS.md](COMMANDS.md) | Full command reference for all tools |
| [CORE_VERBS.md](CORE_VERBS.md) | Consistent verbs used across tools |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute |

Or just run `friendly learn all` to see everything in your terminal!

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Ways to Help:**
- **Report bugs** — Found something broken? Open an issue
- **Suggest commands** — Have a command idea? Let us know
- **Add tools** — Want to add `yarn`, `cargo`, `kubectl`? PRs welcome
- **Improve docs** — Typos, unclear explanations, translations

**Development:**

```bash
# Clone and install
git clone https://github.com/friendly-terminal/friendly-terminal.git
cd friendly-terminal
npm install

# Test locally
npm link
friendly tour

# Or test without linking
node bin/friendly.js git help
```

---

## Star History

<p align="center">
  <a href="https://star-history.com/#friendly-terminal/friendly-terminal&Date">
    <img src="https://api.star-history.com/svg?repos=friendly-terminal/friendly-terminal&type=Date" alt="Star History">
  </a>
</p>

---

## Contributors

<p align="center">
  <a href="https://github.com/friendly-terminal/friendly-terminal/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=friendly-terminal/friendly-terminal" alt="Contributors">
  </a>
</p>

<p align="center">
  Made with ❤️ by developers who got tired of googling the same commands
</p>

---

## License

[MIT](LICENSE) — use it however you want.

---

<p align="center">
  <strong>Stop memorizing. Start typing what you mean.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/friendly-terminal">npm</a> •
  <a href="https://github.com/friendly-terminal/friendly-terminal">GitHub</a> •
  <a href="https://github.com/friendly-terminal/friendly-terminal/issues">Issues</a>
</p>
