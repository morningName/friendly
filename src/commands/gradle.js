const { execSync } = require('child_process');
const { printCommand } = require('../utils/ascii');
const { printTable } = require('../utils/table');

// Gradle command mappings
const gradleCommands = {
  'build': { cmd: './gradlew build', desc: 'Compiles and builds the entire project' },
  'build clean': { cmd: './gradlew clean build', desc: 'Clears old files then builds fresh' },
  'build debug': { cmd: './gradlew assembleDebug', desc: 'Builds the debug version (Android)' },
  'build release': { cmd: './gradlew assembleRelease', desc: 'Builds the release version (Android)' },
  'run': { cmd: './gradlew run', desc: 'Runs the application' },
  'run boot': { cmd: './gradlew bootRun', desc: 'Runs a Spring Boot application' },
  'test': { cmd: './gradlew test', desc: 'Runs all unit tests' },
  'test device': { cmd: './gradlew connectedAndroidTest', desc: 'Runs tests on a connected Android device' },
  'lint': { cmd: './gradlew lint', desc: 'Checks code for potential bugs and style issues' },
  'clean': { cmd: './gradlew clean', desc: 'Deletes all build outputs' },
  'show tasks': { cmd: './gradlew tasks', desc: 'Lists all available gradle tasks' },
  'show tasks all': { cmd: './gradlew tasks --all', desc: 'Lists all tasks including hidden ones' },
  'show dependencies': { cmd: './gradlew dependencies', desc: 'Shows the full dependency tree' },
  'show projects': { cmd: './gradlew projects', desc: 'Shows all subprojects in a multi-project build' },
  'show signing': { cmd: './gradlew signingReport', desc: 'Shows signing configuration for Android builds' },
  'install debug': { cmd: './gradlew installDebug', desc: 'Installs debug app on connected Android device' },
  'install release': { cmd: './gradlew installRelease', desc: 'Installs release app on connected Android device' },
  'uninstall debug': { cmd: './gradlew uninstallDebug', desc: 'Removes debug app from connected Android device' },
};

function executeGradle(args) {
  const fullCommand = args.join(' ').trim();

  // Check for help
  if (fullCommand === 'help' || fullCommand === '') {
    return printGradleHelp();
  }

  // Check exact matches first
  if (gradleCommands[fullCommand]) {
    const { cmd } = gradleCommands[fullCommand];
    return runCommand(cmd);
  }

  // Not found - pass through to real gradlew
  printCommand('./gradlew ' + fullCommand);
  try {
    execSync('./gradlew ' + fullCommand, { encoding: 'utf-8', stdio: 'inherit' });
  } catch (e) {
    // gradlew already printed the error
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

function printGradleHelp() {
  const headers = ['Friendly Command', 'Actual Command', 'What It Does'];
  const colWidths = [30, 35, 50];

  const rows = [
    ['BUILDING', '', ''],
    ['gradle build', './gradlew build', 'Compiles and builds the entire project'],
    ['gradle build clean', './gradlew clean build', 'Clears old files then builds fresh'],
    ['gradle build debug', './gradlew assembleDebug', 'Builds the debug version (Android)'],
    ['gradle build release', './gradlew assembleRelease', 'Builds the release version (Android)'],
    ['', '', ''],
    ['RUNNING', '', ''],
    ['gradle run', './gradlew run', 'Runs the application'],
    ['gradle run boot', './gradlew bootRun', 'Runs a Spring Boot application'],
    ['', '', ''],
    ['TESTING', '', ''],
    ['gradle test', './gradlew test', 'Runs all unit tests'],
    ['gradle test device', './gradlew connectedAndroidTest', 'Runs tests on a connected Android device'],
    ['gradle lint', './gradlew lint', 'Checks code for potential bugs and style issues'],
    ['', '', ''],
    ['SHOWING INFORMATION', '', ''],
    ['gradle show tasks', './gradlew tasks', 'Lists all available gradle tasks'],
    ['gradle show tasks all', './gradlew tasks --all', 'Lists all tasks including hidden ones'],
    ['gradle show dependencies', './gradlew dependencies', 'Shows the full dependency tree'],
    ['gradle show projects', './gradlew projects', 'Shows all subprojects in a multi-project build'],
    ['gradle show signing', './gradlew signingReport', 'Shows signing configuration for Android builds'],
    ['', '', ''],
    ['ANDROID DEVICE', '', ''],
    ['gradle install debug', './gradlew installDebug', 'Installs debug app on connected Android device'],
    ['gradle install release', './gradlew installRelease', 'Installs release app on connected Android device'],
    ['gradle uninstall debug', './gradlew uninstallDebug', 'Removes debug app from connected Android device'],
    ['', '', ''],
    ['CLEANING', '', ''],
    ['gradle clean', './gradlew clean', 'Deletes all build outputs'],
  ];

  console.log('');
  printTable('GRADLE COMMANDS', headers, rows, colWidths);
  console.log('');
}

module.exports = {
  executeGradle,
  printGradleHelp
};
