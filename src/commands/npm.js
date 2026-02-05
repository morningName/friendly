const { execSync } = require('child_process');
const { printCommand } = require('../utils/ascii');
const { printTable } = require('../utils/table');

// NPM command mappings
const npmCommands = {
  'setup': { cmd: 'npm install', desc: 'Installs all project dependencies from package.json' },
  'show packages': { cmd: 'npm list --depth=0', desc: 'Shows all installed packages' },
  'show outdated': { cmd: 'npm outdated', desc: 'Shows packages that have newer versions' },
  'update': { cmd: 'npm update', desc: 'Updates all packages to latest allowed versions' },
  'run start': { cmd: 'npm run start', desc: 'Starts the application' },
  'run dev': { cmd: 'npm run dev', desc: 'Starts the application in development mode' },
  'run test': { cmd: 'npm test', desc: 'Runs the test suite' },
  'run build': { cmd: 'npm run build', desc: 'Builds the application for production' },
  'run lint': { cmd: 'npm run lint', desc: 'Checks code for style and syntax issues' },
};

// Commands that need arguments
const npmCommandsWithArgs = {
  'add': (pkg) => {
    if (pkg.includes('--dev')) {
      const pkgName = pkg.replace('--dev', '').trim();
      return { cmd: `npm install ${pkgName} --save-dev`, desc: `Adds ${pkgName} as a dev dependency` };
    }
    return { cmd: `npm install ${pkg}`, desc: `Adds ${pkg} to your project` };
  },
  'remove': (pkg) => ({ cmd: `npm uninstall ${pkg}`, desc: `Removes ${pkg} from your project` }),
  'run': (script) => ({ cmd: `npm run ${script}`, desc: `Runs the ${script} script` }),
};

function executeNpm(args) {
  const fullCommand = args.join(' ').trim();

  // Check for help
  if (fullCommand === 'help' || fullCommand === '') {
    return printNpmHelp();
  }

  // Check exact matches first
  if (npmCommands[fullCommand]) {
    const { cmd } = npmCommands[fullCommand];
    return runCommand(cmd);
  }

  // Check commands with arguments
  for (const [pattern, handler] of Object.entries(npmCommandsWithArgs)) {
    if (fullCommand.startsWith(pattern + ' ') || fullCommand === pattern) {
      const arg = fullCommand.slice(pattern.length).trim();
      if (arg) {
        const { cmd } = handler(arg);
        return runCommand(cmd);
      }
    }
  }

  // Not found - pass through to real npm
  printCommand('npm ' + fullCommand);
  try {
    execSync('npm ' + fullCommand, { encoding: 'utf-8', stdio: 'inherit' });
  } catch (e) {
    // npm already printed the error
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

function printNpmHelp() {
  const headers = ['Friendly Command', 'Actual Command', 'What It Does'];
  const colWidths = [30, 35, 50];

  const rows = [
    ['SETUP', '', ''],
    ['npm setup', 'npm install', 'Installs all project dependencies from package.json'],
    ['', '', ''],
    ['PACKAGES', '', ''],
    ['npm add <package>', 'npm install <package>', 'Adds a new package to your project'],
    ['npm add <package> --dev', 'npm install <pkg> --save-dev', 'Adds a package as a dev dependency'],
    ['npm remove <package>', 'npm uninstall <package>', 'Removes a package from your project'],
    ['npm show packages', 'npm list --depth=0', 'Shows all installed packages'],
    ['npm show outdated', 'npm outdated', 'Shows packages that have newer versions'],
    ['npm update', 'npm update', 'Updates all packages to latest allowed versions'],
    ['', '', ''],
    ['RUNNING', '', ''],
    ['npm run start', 'npm run start', 'Starts the application'],
    ['npm run dev', 'npm run dev', 'Starts the application in development mode'],
    ['npm run test', 'npm test', 'Runs the test suite'],
    ['npm run build', 'npm run build', 'Builds the application for production'],
    ['npm run lint', 'npm run lint', 'Checks code for style and syntax issues'],
    ['npm run <script>', 'npm run <script>', 'Runs any script defined in package.json'],
  ];

  console.log('');
  printTable('NPM COMMANDS', headers, rows, colWidths);
  console.log('');
}

module.exports = {
  executeNpm,
  printNpmHelp
};
