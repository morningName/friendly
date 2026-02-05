const { executeGit, printGitHelp } = require('./commands/git');
const { executeNpm, printNpmHelp } = require('./commands/npm');
const { executeDocker, printDockerHelp } = require('./commands/docker');
const { executeGradle, printGradleHelp } = require('./commands/gradle');
const { executeMaven, printMavenHelp } = require('./commands/maven');
const { executeFiles, printFilesHelp } = require('./commands/files');
const { printLogo, printWelcome } = require('./utils/ascii');
const { printTable, printSimpleTable } = require('./utils/table');
const { handleMode, getMode } = require('./mode');
const { runTour, runQuickTour } = require('./tour');
const chalk = require('chalk');

function showMainHelp() {
  printLogo();
  printWelcome();

  // What is Friendly Terminal
  console.log(chalk.hex('#8B5CF6')('  What is Friendly Terminal?\n'));
  console.log(chalk.white('    Tired of googling "how to undo git commit" every time?'));
  console.log(chalk.white('    Friendly Terminal lets you type readable commands like:'));
  console.log('');
  console.log('      ' + chalk.green('git rewind 1 commit') + chalk.gray('     instead of   ') + chalk.white('git reset --soft HEAD~1'));
  console.log('      ' + chalk.green('git show changes') + chalk.gray('        instead of   ') + chalk.white('git status'));
  console.log('      ' + chalk.green('npm add lodash --dev') + chalk.gray('    instead of   ') + chalk.white('npm install lodash --save-dev'));
  console.log('');
  console.log(chalk.white('    We translate them for you AND show what\'s running, so you learn!'));
  console.log('');

  // Available tools
  console.log(chalk.hex('#8B5CF6')('  Supported Tools:\n'));
  console.log('    ' + chalk.green('git') + '      ' + chalk.white('Track changes, save work, collaborate with your team'));
  console.log('    ' + chalk.green('npm') + '      ' + chalk.white('Install packages, manage dependencies, run scripts'));
  console.log('    ' + chalk.green('gradle') + '   ' + chalk.white('Build and run Java/Android projects'));
  console.log('    ' + chalk.green('maven') + '    ' + chalk.white('Build, test, and package Java applications'));
  console.log('    ' + chalk.green('docker') + '   ' + chalk.white('Run apps in containers, manage images'));
  console.log('    ' + chalk.green('files') + '    ' + chalk.white('Search for files, find text in your project'));
  console.log('');

  // Getting started
  console.log(chalk.hex('#8B5CF6')('  Getting Started:\n'));
  console.log('    ' + chalk.green('friendly setup') + '         ' + chalk.white('Add friendly commands to your shell (one-time setup)'));
  console.log('    ' + chalk.green('friendly tour') + '          ' + chalk.white('Take a 2-minute guided walkthrough of all features'));
  console.log('    ' + chalk.green('friendly learn') + '         ' + chalk.white('Browse all commands as a cheat sheet (no setup needed)'));
  console.log('');

  // Two modes
  console.log(chalk.hex('#8B5CF6')('  Two Modes:\n'));
  console.log(chalk.white('    After setup, you can switch between two modes anytime:\n'));
  console.log('    ' + chalk.bold.white('Friendly Mode') + chalk.white(' - Commands are translated for you'));
  console.log(chalk.gray('      "git show changes" becomes "git status"'));
  console.log('');
  console.log('    ' + chalk.bold.white('Traditional Mode') + chalk.white(' - Commands pass through unchanged'));
  console.log(chalk.gray('      "git status" stays "git status" (help & learn still work!)'));
  console.log('');
  console.log('    ' + chalk.green('friendly mode') + '              ' + chalk.white('Check which mode you\'re in'));
  console.log('    ' + chalk.green('friendly mode traditional') + '  ' + chalk.white('Switch to traditional commands'));
  console.log('    ' + chalk.green('friendly mode friendly') + '     ' + chalk.white('Switch back to friendly commands'));
  console.log('');

  // Quick examples
  console.log(chalk.hex('#8B5CF6')('  Try These Now:\n'));
  console.log('    ' + chalk.green('friendly git help') + '          ' + chalk.white('See all friendly git commands'));
  console.log('    ' + chalk.green('friendly learn git') + '         ' + chalk.white('Browse git commands as a reference'));
  console.log('    ' + chalk.green('friendly tour quick') + '        ' + chalk.white('Quick summary of features'));
  console.log('');
}

function showLearnMenu(tool) {
  printLogo();

  if (!tool) {
    // Show all tools menu
    console.log(chalk.green('  ╔════════════════════════════════════════════════════════════╗'));
    console.log(chalk.green('  ║                                                            ║'));
    console.log(chalk.green('  ║   Learn Mode - Browse commands without installing          ║'));
    console.log(chalk.green('  ║                                                            ║'));
    console.log(chalk.green('  ║   See what each tool can do, then use the traditional      ║'));
    console.log(chalk.green('  ║   commands directly. No setup required!                    ║'));
    console.log(chalk.green('  ║                                                            ║'));
    console.log(chalk.green('  ╚════════════════════════════════════════════════════════════╝'));
    console.log('');
    console.log('  Available command references:\n');

    const learnOptions = [
      { key: 'friendly learn git', value: 'Git version control' },
      { key: 'friendly learn npm', value: 'NPM package management' },
      { key: 'friendly learn gradle', value: 'Gradle build tool' },
      { key: 'friendly learn maven', value: 'Maven build tool' },
      { key: 'friendly learn docker', value: 'Docker containers' },
      { key: 'friendly learn files', value: 'File operations' },
      { key: 'friendly learn all', value: 'Show everything' },
    ];

    printSimpleTable(learnOptions);
    console.log('');
    console.log('  ' + chalk.gray('Tip: You can use the traditional commands shown in the tables.'));
    console.log('  ' + chalk.gray('     No need to install anything - just learn and use!'));
    console.log('');
    return;
  }

  // Show specific tool help
  switch (tool) {
    case 'git':
      printLearnHeader('Git', 'Version control - track changes, collaborate with others');
      printGitHelp();
      printLearnFooter();
      break;
    case 'npm':
      printLearnHeader('NPM', 'Node.js package manager - install and manage dependencies');
      printNpmHelp();
      printLearnFooter();
      break;
    case 'gradle':
      printLearnHeader('Gradle', 'Build tool for Java and Android projects');
      printGradleHelp();
      printLearnFooter();
      break;
    case 'maven':
      printLearnHeader('Maven', 'Build tool for Java projects');
      printMavenHelp();
      printLearnFooter();
      break;
    case 'docker':
      printLearnHeader('Docker', 'Container platform - run apps in isolated environments');
      printDockerHelp();
      printLearnFooter();
      break;
    case 'files':
      printLearnHeader('Files', 'Search and view files in your project');
      printFilesHelp();
      printLearnFooter();
      break;
    case 'all':
      printLearnHeader('All Commands', 'Complete reference for all tools');
      console.log(chalk.bold.yellow('\n  ═══════════════════════════════════════════════════════════'));
      console.log(chalk.bold.yellow('  GIT - Version Control'));
      console.log(chalk.bold.yellow('  ═══════════════════════════════════════════════════════════\n'));
      printGitHelp();
      console.log(chalk.bold.yellow('\n  ═══════════════════════════════════════════════════════════'));
      console.log(chalk.bold.yellow('  NPM - Package Management'));
      console.log(chalk.bold.yellow('  ═══════════════════════════════════════════════════════════\n'));
      printNpmHelp();
      console.log(chalk.bold.yellow('\n  ═══════════════════════════════════════════════════════════'));
      console.log(chalk.bold.yellow('  GRADLE - Java/Android Build Tool'));
      console.log(chalk.bold.yellow('  ═══════════════════════════════════════════════════════════\n'));
      printGradleHelp();
      console.log(chalk.bold.yellow('\n  ═══════════════════════════════════════════════════════════'));
      console.log(chalk.bold.yellow('  MAVEN - Java Build Tool'));
      console.log(chalk.bold.yellow('  ═══════════════════════════════════════════════════════════\n'));
      printMavenHelp();
      console.log(chalk.bold.yellow('\n  ═══════════════════════════════════════════════════════════'));
      console.log(chalk.bold.yellow('  DOCKER - Container Management'));
      console.log(chalk.bold.yellow('  ═══════════════════════════════════════════════════════════\n'));
      printDockerHelp();
      console.log(chalk.bold.yellow('\n  ═══════════════════════════════════════════════════════════'));
      console.log(chalk.bold.yellow('  FILES - File Operations'));
      console.log(chalk.bold.yellow('  ═══════════════════════════════════════════════════════════\n'));
      printFilesHelp();
      printLearnFooter();
      break;
    default:
      console.log(`  Unknown tool: ${tool}`);
      console.log('  Available: git, npm, gradle, maven, docker, files, all');
  }
}

function printLearnHeader(toolName, description) {
  console.log('');
  console.log(chalk.green('  ┌────────────────────────────────────────────────────────────┐'));
  console.log(chalk.green('  │ ') + chalk.bold.white(`LEARN: ${toolName}`) + ' '.repeat(51 - toolName.length) + chalk.green(' │'));
  console.log(chalk.green('  │ ') + chalk.gray(description) + ' '.repeat(59 - description.length) + chalk.green(' │'));
  console.log(chalk.green('  └────────────────────────────────────────────────────────────┘'));
}

function printLearnFooter() {
  console.log('');
  console.log(chalk.gray('  ─────────────────────────────────────────────────────────────'));
  console.log(chalk.gray('  Tip: Use the "Actual Command" column directly in your terminal.'));
  console.log(chalk.gray('       No installation needed - these are standard commands!'));
  console.log('');
  console.log(chalk.gray('  Want the friendly shortcuts? Run: ') + chalk.cyan('friendly setup'));
  console.log('');
}

function main(args) {
  if (args.length === 0) {
    showMainHelp();
    return;
  }

  const tool = args[0];
  const toolArgs = args.slice(1);

  switch (tool) {
    case 'git':
      executeGit(toolArgs);
      break;
    case 'npm':
      executeNpm(toolArgs);
      break;
    case 'docker':
      executeDocker(toolArgs);
      break;
    case 'gradle':
      executeGradle(toolArgs);
      break;
    case 'maven':
      executeMaven(toolArgs);
      break;
    case 'files':
      executeFiles(toolArgs);
      break;
    case 'setup':
      require('./setup').runSetup();
      break;
    case 'learn':
    case 'docs':
    case 'reference':
      showLearnMenu(toolArgs[0]);
      break;
    case 'mode':
      handleMode(toolArgs);
      break;
    case 'tour':
    case 'walkthrough':
      if (toolArgs[0] === 'quick' || toolArgs[0] === 'fast') {
        runQuickTour();
      } else {
        runTour();
      }
      break;
    case 'help':
      showMainHelp();
      break;
    default:
      console.log(`Unknown tool: ${tool}`);
      console.log('Available tools: git, npm, docker, gradle, maven, files');
      console.log('Type "friendly help" for more information.');
  }
}

module.exports = { main, showMainHelp, showLearnMenu };

