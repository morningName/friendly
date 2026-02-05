const fs = require('fs');
const path = require('path');
const os = require('os');
const chalk = require('chalk');
const { printSuccess, printInfo } = require('./utils/ascii');

const CONFIG_DIR = path.join(os.homedir(), '.friendly-terminal');
const MODE_FILE = path.join(CONFIG_DIR, 'mode');

/**
 * Get current mode: 'friendly' or 'traditional'
 */
function getMode() {
  try {
    if (fs.existsSync(MODE_FILE)) {
      const mode = fs.readFileSync(MODE_FILE, 'utf-8').trim();
      if (mode === 'traditional' || mode === 'friendly') {
        return mode;
      }
    }
  } catch (e) {
    // Ignore errors
  }
  return 'friendly'; // Default
}

/**
 * Set mode: 'friendly' or 'traditional'
 */
function setMode(mode) {
  if (mode !== 'friendly' && mode !== 'traditional') {
    console.log(chalk.red(`  Invalid mode: ${mode}`));
    console.log('  Available modes: friendly, traditional');
    return false;
  }

  // Ensure config directory exists
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }

  fs.writeFileSync(MODE_FILE, mode);
  return true;
}

/**
 * Show current mode or switch modes
 */
function handleMode(args) {
  const newMode = args[0];

  if (!newMode) {
    // Show current mode
    const currentMode = getMode();
    console.log('');
    console.log(chalk.bold('  Current Mode: ') + chalk.cyan(currentMode));
    console.log('');

    if (currentMode === 'friendly') {
      console.log('  Your commands are translated to traditional commands.');
      console.log('  Example: ' + chalk.cyan('git show changes') + ' → ' + chalk.gray('git status'));
    } else {
      console.log('  Commands pass through directly to traditional tools.');
      console.log('  Example: ' + chalk.cyan('git show changes') + ' → ' + chalk.gray('git show changes (unchanged)'));
    }

    console.log('');
    console.log('  Switch modes:');
    console.log('    friendly mode friendly      Use friendly translations');
    console.log('    friendly mode traditional   Pass through to real commands');
    console.log('');
    console.log(chalk.gray('  Note: "friendly learn" and "friendly help" always work in both modes.'));
    console.log('');
    return;
  }

  // Switch mode
  if (setMode(newMode)) {
    console.log('');
    if (newMode === 'friendly') {
      printSuccess('Switched to friendly mode');
      console.log('');
      console.log('  Commands will be translated:');
      console.log('    ' + chalk.cyan('git show changes') + ' → ' + chalk.gray('git status'));
      console.log('    ' + chalk.cyan('git save "msg"') + ' → ' + chalk.gray('git add . && git commit -m "msg"'));
    } else {
      printSuccess('Switched to traditional mode');
      console.log('');
      console.log('  Commands will pass through unchanged:');
      console.log('    ' + chalk.cyan('git status') + ' → ' + chalk.gray('git status'));
      console.log('    ' + chalk.cyan('git commit -m "msg"') + ' → ' + chalk.gray('git commit -m "msg"'));
      console.log('');
      console.log(chalk.gray('  Tip: "friendly learn git" still shows you the command reference!'));
    }
    console.log('');
  }
}

module.exports = {
  getMode,
  setMode,
  handleMode
};
