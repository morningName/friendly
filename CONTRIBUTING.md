# Contributing to Friendly Terminal

First off, thank you for considering contributing to Friendly Terminal! It's people like you that make this tool better for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting New Commands](#suggesting-new-commands)
  - [Adding New Tools](#adding-new-tools)
  - [Improving Documentation](#improving-documentation)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Pull Request Process](#pull-request-process)
- [Style Guide](#style-guide)

---

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

---

## How Can I Contribute?

### Reporting Bugs

Found a bug? Please open an issue with:

1. **Description**: What happened?
2. **Expected behavior**: What should have happened?
3. **Steps to reproduce**: How can we see the bug?
4. **Environment**: OS, Node.js version, shell (bash/zsh/PowerShell)

### Suggesting New Commands

Have an idea for a new friendly command? Open an issue with:

1. **The friendly command**: What would users type?
2. **The traditional command**: What does it translate to?
3. **Why it's useful**: When would someone use this?

**Good command suggestions:**
- Use consistent verbs (show, save, sync, create, delete, etc.)
- Are readable in plain English
- Don't conflict with existing commands

### Adding New Tools

Want to add support for a new tool (like `yarn`, `cargo`, `kubectl`)?

1. Create a new file in `src/commands/` (e.g., `yarn.js`)
2. Follow the pattern of existing command files
3. Add the tool to `src/index.js`
4. Update `src/setup.js` with shell wrappers
5. Add documentation to `COMMANDS.md`
6. Update the README

### Improving Documentation

Documentation improvements are always welcome:

- Fix typos or unclear explanations
- Add more examples
- Translate to other languages
- Improve the tour/walkthrough

---

## Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/friendly-terminal.git
cd friendly-terminal

# Install dependencies
npm install

# Link for local testing
npm link

# Now you can test your changes
friendly tour
friendly git help
```

### Testing Your Changes

```bash
# Test the CLI directly without linking
node bin/friendly.js tour
node bin/friendly.js git help
node bin/friendly.js learn git

# Test a specific command
node bin/friendly.js git show changes
```

---

## Project Structure

```
friendly-terminal/
├── bin/
│   └── friendly.js          # CLI entry point
├── src/
│   ├── commands/            # Command implementations
│   │   ├── git.js           # Git commands
│   │   ├── npm.js           # NPM commands
│   │   ├── docker.js        # Docker commands
│   │   ├── gradle.js        # Gradle commands
│   │   ├── maven.js         # Maven commands
│   │   └── files.js         # File commands
│   ├── utils/
│   │   ├── ascii.js         # Logo, welcome messages
│   │   └── table.js         # Table formatting
│   ├── index.js             # Main entry, routing
│   ├── setup.js             # Shell configuration
│   ├── mode.js              # Mode switching logic
│   └── tour.js              # Interactive tour
├── COMMANDS.md              # Full command reference
├── CORE_VERBS.md            # Verb consistency guide
├── CONTRIBUTING.md          # This file
├── LICENSE                  # MIT License
├── README.md                # Main documentation
└── package.json
```

### How Commands Work

Each command file (e.g., `src/commands/git.js`) contains:

1. **Command mappings**: Object mapping friendly commands to actual commands
2. **Execute function**: Parses input and runs the appropriate command
3. **Help function**: Prints the help table for that tool

Example structure:

```javascript
// Simple commands (no arguments)
const commands = {
  'show changes': { cmd: 'git status', desc: 'Shows modified files' },
  'show diff': { cmd: 'git diff', desc: 'Shows line changes' },
};

// Commands with arguments
const commandsWithArgs = {
  'save': (msg) => ({ cmd: `git add . && git commit -m "${msg}"`, desc: '...' }),
  'switch': (branch) => ({ cmd: `git checkout ${branch}`, desc: '...' }),
};
```

---

## Pull Request Process

1. **Fork** the repository
2. **Create a branch** for your feature (`git checkout -b add-yarn-support`)
3. **Make your changes** with clear commit messages
4. **Test** your changes locally
5. **Update documentation** if needed
6. **Submit a pull request** with a clear description

### PR Checklist

- [ ] Code follows the existing style
- [ ] Commands use consistent verbs
- [ ] Help tables are updated
- [ ] COMMANDS.md is updated (if adding commands)
- [ ] README is updated (if adding features)
- [ ] Tested locally with `npm link`

---

## Style Guide

### Command Naming

- Use consistent verbs: `show`, `save`, `sync`, `create`, `delete`, `add`, `remove`
- Commands should read like plain English
- Keep commands under 5 words
- Use the format: `<tool> <verb> <target> [modifiers]`

```
Good:  git show changes
Good:  git sync upload
Good:  docker show containers
Bad:   git display-current-status
Bad:   git sc  (too cryptic)
```

### Code Style

- Use `const` for requires and fixed values
- Use clear function names
- Add comments for complex logic
- Keep functions focused and small

### Commit Messages

- Use present tense: "Add feature" not "Added feature"
- Be descriptive: "Add yarn support with install/add/remove commands"
- Reference issues: "Fix #123: Handle spaces in filenames"

---

## Questions?

Feel free to open an issue with any questions. We're happy to help!
