const chalk = require('chalk');

const logo = `
  ███████╗██████╗ ██╗███████╗███╗   ██╗██████╗ ██╗  ██╗   ██╗
  ██╔════╝██╔══██╗██║██╔════╝████╗  ██║██╔══██╗██║  ╚██╗ ██╔╝
  █████╗  ██████╔╝██║█████╗  ██╔██╗ ██║██║  ██║██║   ╚████╔╝
  ██╔══╝  ██╔══██╗██║██╔══╝  ██║╚██╗██║██║  ██║██║    ╚██╔╝
  ██║     ██║  ██║██║███████╗██║ ╚████║██████╔╝███████╗██║
  ╚═╝     ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝
`;

const welcome = `
  ╔════════════════════════════════════════════════════════════╗
  ║                                                            ║
  ║   Welcome to Friendly Terminal!                            ║
  ║                                                            ║
  ║   Human-readable commands for your terminal.               ║
  ║   Type 'friendly help' to see all commands.                ║
  ║                                                            ║
  ╚════════════════════════════════════════════════════════════╝
`;

const setupComplete = `
  ╔════════════════════════════════════════════════════════════╗
  ║                                                            ║
  ║   Setup Complete!                                          ║
  ║                                                            ║
  ║   Restart your terminal or run:                            ║
  ║                                                            ║
  ║     source ~/.zshrc     (Mac/Linux zsh)                    ║
  ║     source ~/.bashrc    (Mac/Linux bash)                   ║
  ║                                                            ║
  ║   Then try:                                                ║
  ║                                                            ║
  ║     friendly tour        Take a quick walkthrough          ║
  ║     git show changes     See modified files                ║
  ║     git help             See all git commands              ║
  ║                                                            ║
  ╚════════════════════════════════════════════════════════════╝
`;

function printLogo() {
  console.log(chalk.green(logo));
}

function printWelcome() {
  console.log(chalk.green(welcome));
}

function printSetupComplete() {
  console.log(chalk.green(setupComplete));
}

function printSuccess(message) {
  console.log(chalk.green('  ✓ ' + message));
}

function printError(message) {
  console.log(chalk.red('  ✗ ' + message));
}

function printWarning(message) {
  console.log(chalk.yellow('  ⚠ ' + message));
}

function printInfo(message) {
  console.log(chalk.blue('  ℹ ' + message));
}

function printCommand(command) {
  console.log(chalk.gray('  Running: ') + chalk.white(command));
}

module.exports = {
  logo,
  welcome,
  setupComplete,
  printLogo,
  printWelcome,
  printSetupComplete,
  printSuccess,
  printError,
  printWarning,
  printInfo,
  printCommand
};
