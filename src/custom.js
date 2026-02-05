const fs = require('fs');
const path = require('path');
const os = require('os');
const chalk = require('chalk');
const { execSync } = require('child_process');
const { printCommand } = require('./utils/ascii');
const { printTable } = require('./utils/table');

// Config directory and file
const CONFIG_DIR = path.join(os.homedir(), '.friendly-terminal');
const CUSTOM_FILE = path.join(CONFIG_DIR, 'custom-commands.json');

// Ensure config directory exists
function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

// Load custom commands
function loadCustomCommands() {
  ensureConfigDir();
  if (fs.existsSync(CUSTOM_FILE)) {
    try {
      const data = fs.readFileSync(CUSTOM_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      return {};
    }
  }
  return {};
}

// Save custom commands
function saveCustomCommands(commands) {
  ensureConfigDir();
  fs.writeFileSync(CUSTOM_FILE, JSON.stringify(commands, null, 2));
}

// Add a custom command to a package
// Format: friendly custom <package> "<friendly>" : "<actual>"
function addCustomCommand(packageName, friendlyCmd, actualCmd) {
  const commands = loadCustomCommands();

  // Initialize package if doesn't exist
  if (!commands[packageName]) {
    commands[packageName] = {};
  }

  commands[packageName][friendlyCmd] = {
    cmd: actualCmd,
    desc: `Custom: ${actualCmd}`
  };

  saveCustomCommands(commands);

  console.log('');
  console.log(chalk.green('  ✓ Custom command added successfully!'));
  console.log('');
  console.log('    Package:  ' + chalk.cyan(packageName));
  console.log('    Friendly: ' + chalk.green(friendlyCmd));
  console.log('    Runs:     ' + chalk.white(actualCmd));
  console.log('');
  console.log(chalk.gray('  Usage: ') + chalk.cyan(`friendly ${packageName} ${friendlyCmd}`));
  console.log('');
}

// Remove a custom command
function removeCustomCommand(packageName, friendlyCmd) {
  const commands = loadCustomCommands();

  if (commands[packageName] && commands[packageName][friendlyCmd]) {
    delete commands[packageName][friendlyCmd];

    // Remove package if empty
    if (Object.keys(commands[packageName]).length === 0) {
      delete commands[packageName];
    }

    saveCustomCommands(commands);
    console.log('');
    console.log(chalk.green(`  ✓ Removed: ${packageName} "${friendlyCmd}"`));
    console.log('');
  } else {
    console.log('');
    console.log(chalk.yellow(`  ⚠ Command not found: ${packageName} "${friendlyCmd}"`));
    console.log('');
  }
}

// List all custom commands
function listCustomCommands() {
  const commands = loadCustomCommands();
  const packages = Object.keys(commands);

  console.log('');
  if (packages.length === 0) {
    console.log(chalk.yellow('  No custom commands defined yet.'));
    console.log('');
    console.log('  Add one with:');
    console.log(chalk.cyan('    friendly custom <package> "<friendly command>" : "<actual command>"'));
    console.log('');
    console.log('  Examples:');
    console.log(chalk.green('    friendly custom deploy "push" : "git push origin main && npm run build"'));
    console.log(chalk.green('    friendly custom npm "quick test" : "npm run test -- --watch"'));
    console.log(chalk.green('    friendly custom git "yolo" : "git add . && git commit -m \'update\' && git push"'));
    console.log('');
    return;
  }

  const headers = ['Package', 'Friendly Command', 'Actual Command'];
  const colWidths = [15, 30, 55];

  const rows = [];

  for (const pkg of packages) {
    rows.push([pkg.toUpperCase(), '', '']);
    for (const [friendly, { cmd }] of Object.entries(commands[pkg])) {
      rows.push([
        '',
        `${pkg} ${friendly}`,
        cmd.length > 53 ? cmd.substring(0, 50) + '...' : cmd
      ]);
    }
    rows.push(['', '', '']);
  }

  printTable('YOUR CUSTOM COMMANDS', headers, rows, colWidths);
  console.log('');
  console.log(chalk.gray(`  Config file: ${CUSTOM_FILE}`));
  console.log('');
}

// Get custom command for a package
function getCustomCommand(packageName, friendlyCmd) {
  const commands = loadCustomCommands();

  if (commands[packageName] && commands[packageName][friendlyCmd]) {
    return commands[packageName][friendlyCmd];
  }

  return null;
}

// Check if package has any custom commands
function hasCustomPackage(packageName) {
  const commands = loadCustomCommands();
  return !!commands[packageName] && Object.keys(commands[packageName]).length > 0;
}

// Get all commands for a package
function getCustomPackageCommands(packageName) {
  const commands = loadCustomCommands();
  return commands[packageName] || {};
}

// Run a custom command
function runCustomCommand(packageName, friendlyCmd) {
  const customCmd = getCustomCommand(packageName, friendlyCmd);

  if (customCmd) {
    printCommand(customCmd.cmd);
    console.log('');
    try {
      execSync(customCmd.cmd, { encoding: 'utf-8', stdio: 'inherit', shell: true });
      console.log('');
    } catch (e) {
      // Command already printed error
    }
    return true;
  }

  return false;
}

// Check if a specific custom command exists
function hasCustomCommand(packageName, friendlyCmd) {
  const commands = loadCustomCommands();
  return !!(commands[packageName] && commands[packageName][friendlyCmd]);
}

// Get all custom packages
function getCustomPackages() {
  const commands = loadCustomCommands();
  return Object.keys(commands);
}

// Parse the command syntax: package "friendly" : "actual"
// Also supports: package "friendly" "actual" (without colon)
function parseAddCommand(args) {
  const fullArgs = args.join(' ');

  // Match: package "friendly" : "actual" or package "friendly":"actual"
  let match = fullArgs.match(/^(\S+)\s+"([^"]+)"\s*:\s*"([^"]+)"$/);

  if (match) {
    return {
      package: match[1],
      friendly: match[2],
      actual: match[3]
    };
  }

  // Also try: package "friendly" "actual" (without colon)
  match = fullArgs.match(/^(\S+)\s+"([^"]+)"\s+"([^"]+)"$/);
  if (match) {
    return {
      package: match[1],
      friendly: match[2],
      actual: match[3]
    };
  }

  // Try simpler: first arg is package, look for quoted strings
  if (args.length >= 3) {
    const pkg = args[0];
    // Find all quoted strings
    const quoted = fullArgs.match(/"[^"]+"/g);
    if (quoted && quoted.length >= 2) {
      return {
        package: pkg,
        friendly: quoted[0].replace(/"/g, ''),
        actual: quoted[1].replace(/"/g, '')
      };
    }
  }

  return null;
}

// Handle custom command CLI
function handleCustom(args) {
  if (args.length === 0 || args[0] === 'help') {
    printCustomHelp();
    return;
  }

  if (args[0] === 'list' || args[0] === 'show') {
    listCustomCommands();
    return;
  }

  if (args[0] === 'remove' || args[0] === 'delete') {
    // friendly custom remove <package> "<command>"
    const pkg = args[1];
    const cmd = args[2];

    if (!pkg || !cmd) {
      console.log('');
      console.log(chalk.red('  ✗ Usage: friendly custom remove <package> "<command>"'));
      console.log('');
      console.log('  Example:');
      console.log(chalk.cyan('    friendly custom remove npm "quick test"'));
      console.log('');
      return;
    }

    removeCustomCommand(pkg, cmd);
    return;
  }

  if (args[0] === 'edit') {
    const editor = process.env.EDITOR || (process.platform === 'win32' ? 'notepad' : 'nano');
    ensureConfigDir();
    if (!fs.existsSync(CUSTOM_FILE)) {
      saveCustomCommands({});
    }
    console.log('');
    console.log(chalk.gray(`  Opening ${CUSTOM_FILE}...`));
    console.log('');
    try {
      execSync(`${editor} "${CUSTOM_FILE}"`, { stdio: 'inherit' });
    } catch (e) {
      console.log(chalk.red('  ✗ Could not open editor'));
    }
    return;
  }

  if (args[0] === 'clear') {
    saveCustomCommands({});
    console.log('');
    console.log(chalk.green('  ✓ All custom commands cleared'));
    console.log('');
    return;
  }

  // Try to parse as add command: package "friendly" : "actual"
  const parsed = parseAddCommand(args);

  if (parsed) {
    addCustomCommand(parsed.package, parsed.friendly, parsed.actual);
    return;
  }

  // If first arg looks like a package name and has quotes, show help
  console.log('');
  console.log(chalk.red('  ✗ Could not parse command'));
  console.log('');
  console.log('  Format:');
  console.log(chalk.cyan('    friendly custom <package> "<friendly command>" : "<actual command>"'));
  console.log('');
  console.log('  Examples:');
  console.log(chalk.green('    friendly custom deploy "push" : "git push origin main"'));
  console.log(chalk.green('    friendly custom npm "quick test" : "npm run test --watch"'));
  console.log('');
}

function printCustomHelp() {
  console.log('');
  console.log(chalk.green('  ╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.green('  ║                                                            ║'));
  console.log(chalk.green('  ║   Custom Commands - Create Your Own Shortcuts              ║'));
  console.log(chalk.green('  ║                                                            ║'));
  console.log(chalk.green('  ╚════════════════════════════════════════════════════════════╝'));
  console.log('');

  console.log(chalk.hex('#8B5CF6')('  Adding Commands:\n'));
  console.log(chalk.white('    Format: friendly custom <package> "<friendly>" : "<actual>"'));
  console.log('');
  console.log(chalk.gray('    Create a new package:'));
  console.log('      ' + chalk.green('friendly custom deploy "push" : "git push origin main && npm run build"'));
  console.log('      ' + chalk.gray('→ Now use: ') + chalk.cyan('friendly deploy push'));
  console.log('');
  console.log(chalk.gray('    Extend existing tools (npm, git, etc):'));
  console.log('      ' + chalk.green('friendly custom npm "quick test" : "npm run test -- --watch"'));
  console.log('      ' + chalk.gray('→ Now use: ') + chalk.cyan('friendly npm quick test'));
  console.log('');
  console.log('      ' + chalk.green('friendly custom git "yolo" : "git add . && git commit -m \'update\' && git push"'));
  console.log('      ' + chalk.gray('→ Now use: ') + chalk.cyan('friendly git yolo'));
  console.log('');

  console.log(chalk.hex('#8B5CF6')('  Managing Commands:\n'));
  console.log('    ' + chalk.green('friendly custom list') + '                    ' + chalk.white('See all custom commands'));
  console.log('    ' + chalk.green('friendly custom remove <pkg> "<cmd>"') + '    ' + chalk.white('Remove a command'));
  console.log('    ' + chalk.green('friendly custom edit') + '                    ' + chalk.white('Edit config file directly'));
  console.log('    ' + chalk.green('friendly custom clear') + '                   ' + chalk.white('Remove all custom commands'));
  console.log('');

  console.log(chalk.hex('#8B5CF6')('  How It Works:\n'));
  console.log(chalk.white('    Custom commands are checked FIRST before built-in commands.'));
  console.log(chalk.white('    This means you can override existing commands if needed!'));
  console.log('');
  console.log(chalk.gray('    Example: Override "git show changes" to do something different:'));
  console.log('      ' + chalk.green('friendly custom git "show changes" : "git status --short"'));
  console.log('');

  console.log(chalk.hex('#8B5CF6')('  Config Location:\n'));
  console.log(chalk.gray(`    ${CUSTOM_FILE}`));
  console.log('');
}

// Print help for a custom package
function printCustomPackageHelp(packageName) {
  const commands = getCustomPackageCommands(packageName);
  const entries = Object.entries(commands);

  if (entries.length === 0) {
    return false;
  }

  const headers = ['Friendly Command', 'Actual Command', 'What It Does'];
  const colWidths = [30, 45, 30];

  const rows = entries.map(([friendly, { cmd, desc }]) => [
    `${packageName} ${friendly}`,
    cmd.length > 43 ? cmd.substring(0, 40) + '...' : cmd,
    'Custom command'
  ]);

  console.log('');
  printTable(`${packageName.toUpperCase()} (CUSTOM)`, headers, rows, colWidths);
  console.log('');

  return true;
}

module.exports = {
  handleCustom,
  loadCustomCommands,
  runCustomCommand,
  hasCustomCommand,
  hasCustomPackage,
  getCustomCommand,
  getCustomPackageCommands,
  getCustomPackages,
  printCustomPackageHelp,
  CUSTOM_FILE
};
