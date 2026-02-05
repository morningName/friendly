const { execSync } = require('child_process');
const { printCommand } = require('../utils/ascii');
const { printTable } = require('../utils/table');

// Maven command mappings
const mavenCommands = {
  'build': { cmd: 'mvn package', desc: 'Compiles and packages the project' },
  'build clean': { cmd: 'mvn clean package', desc: 'Clears old files then builds fresh' },
  'build skip tests': { cmd: 'mvn package -DskipTests', desc: 'Builds without running tests (faster)' },
  'run': { cmd: 'mvn exec:java', desc: 'Runs the main class' },
  'run boot': { cmd: 'mvn spring-boot:run', desc: 'Runs a Spring Boot application' },
  'test': { cmd: 'mvn test', desc: 'Runs all unit tests' },
  'clean': { cmd: 'mvn clean', desc: 'Deletes all build outputs' },
  'show dependencies': { cmd: 'mvn dependency:tree', desc: 'Shows the full dependency tree' },
  'show effective pom': { cmd: 'mvn help:effective-pom', desc: 'Shows the resolved pom with all inherited values' },
};

function executeMaven(args) {
  const fullCommand = args.join(' ').trim();

  // Check for help
  if (fullCommand === 'help' || fullCommand === '') {
    return printMavenHelp();
  }

  // Check exact matches first
  if (mavenCommands[fullCommand]) {
    const { cmd } = mavenCommands[fullCommand];
    return runCommand(cmd);
  }

  // Not found - pass through to real mvn
  printCommand('mvn ' + fullCommand);
  try {
    execSync('mvn ' + fullCommand, { encoding: 'utf-8', stdio: 'inherit' });
  } catch (e) {
    // mvn already printed the error
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

function printMavenHelp() {
  const headers = ['Friendly Command', 'Actual Command', 'What It Does'];
  const colWidths = [30, 30, 50];

  const rows = [
    ['BUILDING', '', ''],
    ['maven build', 'mvn package', 'Compiles and packages the project'],
    ['maven build clean', 'mvn clean package', 'Clears old files then builds fresh'],
    ['maven build skip tests', 'mvn package -DskipTests', 'Builds without running tests (faster)'],
    ['', '', ''],
    ['RUNNING', '', ''],
    ['maven run', 'mvn exec:java', 'Runs the main class'],
    ['maven run boot', 'mvn spring-boot:run', 'Runs a Spring Boot application'],
    ['', '', ''],
    ['TESTING', '', ''],
    ['maven test', 'mvn test', 'Runs all unit tests'],
    ['', '', ''],
    ['SHOWING INFORMATION', '', ''],
    ['maven show dependencies', 'mvn dependency:tree', 'Shows the full dependency tree'],
    ['maven show effective pom', 'mvn help:effective-pom', 'Shows the resolved pom with all inherited values'],
    ['', '', ''],
    ['CLEANING', '', ''],
    ['maven clean', 'mvn clean', 'Deletes all build outputs'],
  ];

  console.log('');
  printTable('MAVEN COMMANDS', headers, rows, colWidths);
  console.log('');
}

module.exports = {
  executeMaven,
  printMavenHelp
};
