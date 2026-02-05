const { execSync } = require('child_process');
const { printCommand } = require('../utils/ascii');
const { printTable } = require('../utils/table');

// Shell scripting command mappings
const shellCommands = {
  'show my shell': { cmd: 'echo $SHELL', desc: 'Shows which shell you are using' },
  'show shell version': { cmd: '$SHELL --version', desc: 'Shows shell version' },
  'show environment': { cmd: 'printenv', desc: 'Shows all environment variables' },
  'show path': { cmd: 'echo $PATH | tr ":" "\\n"', desc: 'Shows PATH directories (one per line)' },
  'show aliases': { cmd: 'alias', desc: 'Shows all defined aliases' },
  'show functions': { cmd: 'declare -F', desc: 'Shows all defined functions' },
  'show history': { cmd: 'history | tail -50', desc: 'Shows last 50 commands' },
  'clear history': { cmd: 'history -c', desc: 'Clears command history' },
  'reload shell': { cmd: 'exec $SHELL', desc: 'Reloads your shell configuration' },
};

// Commands that need arguments
function getCommandWithArgs(command, args) {
  const argStr = args.join(' ');

  // SCRIPT EXECUTION
  if (command === 'make executable' && args.length >= 1) {
    const file = args[0];
    return { cmd: `chmod +x ${file}`, desc: 'Makes script executable' };
  }

  if (command === 'run script' && args.length >= 1) {
    const file = args[0];
    const scriptArgs = args.slice(1).join(' ');
    return { cmd: `bash ${file} ${scriptArgs}`.trim(), desc: 'Runs a shell script' };
  }

  if (command === 'run in background' && args.length >= 1) {
    const cmd = args.join(' ');
    return { cmd: `${cmd} &`, desc: 'Runs command in background' };
  }

  if (command === 'run silent' && args.length >= 1) {
    const cmd = args.join(' ');
    return { cmd: `${cmd} > /dev/null 2>&1`, desc: 'Runs command silently (no output)' };
  }

  if (command === 'run and log' && args.length >= 2) {
    const logfile = args[0];
    const cmd = args.slice(1).join(' ');
    return { cmd: `${cmd} 2>&1 | tee ${logfile}`, desc: 'Runs and saves output to file' };
  }

  // ENVIRONMENT VARIABLES
  if (command === 'set variable' && args.length >= 2) {
    const name = args[0];
    const value = args.slice(1).join(' ');
    return { cmd: `export ${name}="${value}"`, desc: 'Sets environment variable' };
  }

  if (command === 'show variable' && args.length >= 1) {
    const name = args[0];
    return { cmd: `echo $${name}`, desc: 'Shows variable value' };
  }

  if (command === 'add to path' && args.length >= 1) {
    const dir = args[0];
    return { cmd: `export PATH="$PATH:${dir}"`, desc: 'Adds directory to PATH' };
  }

  // ALIASES
  if (command === 'create alias' && args.length >= 2) {
    const name = args[0];
    const cmd = args.slice(1).join(' ');
    return { cmd: `alias ${name}='${cmd}'`, desc: 'Creates a command alias' };
  }

  if (command === 'remove alias' && args.length >= 1) {
    const name = args[0];
    return { cmd: `unalias ${name}`, desc: 'Removes an alias' };
  }

  // SCRIPT CREATION HELPERS
  if (command === 'create script' && args.length >= 1) {
    const file = args[0];
    return { cmd: `cat > ${file} << 'EOF'\n#!/bin/bash\n\n# Your script here\n\nEOF\nchmod +x ${file}`, desc: 'Creates new executable script' };
  }

  if (command === 'edit bashrc') {
    return { cmd: '${EDITOR:-nano} ~/.bashrc', desc: 'Opens .bashrc for editing' };
  }

  if (command === 'edit zshrc') {
    return { cmd: '${EDITOR:-nano} ~/.zshrc', desc: 'Opens .zshrc for editing' };
  }

  if (command === 'edit profile') {
    return { cmd: '${EDITOR:-nano} ~/.profile', desc: 'Opens .profile for editing' };
  }

  // CRON JOBS
  if (command === 'show cron jobs') {
    return { cmd: 'crontab -l', desc: 'Lists scheduled cron jobs' };
  }

  if (command === 'edit cron jobs') {
    return { cmd: 'crontab -e', desc: 'Opens crontab editor' };
  }

  // PROCESS SUBSTITUTION
  if (command === 'watch command' && args.length >= 1) {
    const cmd = args.join(' ');
    return { cmd: `watch -n 2 ${cmd}`, desc: 'Runs command every 2 seconds' };
  }

  if (command === 'repeat' && args.length >= 2) {
    const times = args[0];
    const cmd = args.slice(1).join(' ');
    return { cmd: `for i in $(seq 1 ${times}); do ${cmd}; done`, desc: `Repeats command ${times} times` };
  }

  // INPUT/OUTPUT
  if (command === 'save output to' && args.length >= 2) {
    const file = args[0];
    const cmd = args.slice(1).join(' ');
    return { cmd: `${cmd} > ${file}`, desc: 'Saves command output to file' };
  }

  if (command === 'append output to' && args.length >= 2) {
    const file = args[0];
    const cmd = args.slice(1).join(' ');
    return { cmd: `${cmd} >> ${file}`, desc: 'Appends command output to file' };
  }

  return null;
}

function executeShell(args) {
  const fullCommand = args.join(' ').trim();

  // Check for help
  if (fullCommand === 'help' || fullCommand === '') {
    return printShellHelp();
  }

  // Check exact matches first
  if (shellCommands[fullCommand]) {
    const { cmd } = shellCommands[fullCommand];
    return runCommand(cmd);
  }

  // Check commands with arguments
  const patterns = [
    'make executable', 'run script', 'run in background', 'run silent', 'run and log',
    'set variable', 'show variable', 'add to path',
    'create alias', 'remove alias',
    'create script', 'edit bashrc', 'edit zshrc', 'edit profile',
    'show cron jobs', 'edit cron jobs',
    'watch command', 'repeat',
    'save output to', 'append output to'
  ];

  for (const pattern of patterns) {
    if (fullCommand.startsWith(pattern + ' ') || fullCommand === pattern) {
      const remainingArgs = fullCommand.slice(pattern.length).trim().split(' ').filter(a => a);
      const result = getCommandWithArgs(pattern, remainingArgs);
      if (result) {
        return runCommand(result.cmd);
      }
    }
  }

  // Not found
  console.log(`Unknown shell command: ${fullCommand}`);
  console.log('Type "friendly shell help" for available commands.');
}

function runCommand(cmd) {
  printCommand(cmd);
  console.log('');
  try {
    execSync(cmd, { encoding: 'utf-8', stdio: 'inherit', shell: true });
    console.log('');
  } catch (e) {
    // Command already printed error
  }
}

function printShellHelp() {
  const headers = ['Friendly Command', 'Actual Command', 'What It Does'];
  const colWidths = [35, 45, 40];

  const rows = [
    ['SCRIPT EXECUTION', '', ''],
    ['shell make executable script.sh', 'chmod +x script.sh', 'Makes script executable'],
    ['shell run script myscript.sh', 'bash myscript.sh', 'Runs a shell script'],
    ['shell run in background <cmd>', '<cmd> &', 'Runs command in background'],
    ['shell run silent <cmd>', '<cmd> > /dev/null 2>&1', 'Runs without output'],
    ['shell run and log out.txt <cmd>', '<cmd> 2>&1 | tee out.txt', 'Runs and logs output'],
    ['', '', ''],
    ['ENVIRONMENT', '', ''],
    ['shell show my shell', 'echo $SHELL', 'Shows your current shell'],
    ['shell show environment', 'printenv', 'Shows all env variables'],
    ['shell show path', 'echo $PATH | tr...', 'Shows PATH (one per line)'],
    ['shell show variable HOME', 'echo $HOME', 'Shows variable value'],
    ['shell set variable NAME value', 'export NAME="value"', 'Sets environment variable'],
    ['shell add to path /my/dir', 'export PATH="$PATH:..."', 'Adds directory to PATH'],
    ['', '', ''],
    ['ALIASES', '', ''],
    ['shell show aliases', 'alias', 'Lists all aliases'],
    ['shell create alias ll ls -la', "alias ll='ls -la'", 'Creates a shortcut'],
    ['shell remove alias ll', 'unalias ll', 'Removes an alias'],
    ['', '', ''],
    ['SHELL CONFIG', '', ''],
    ['shell edit bashrc', 'nano ~/.bashrc', 'Edit bash configuration'],
    ['shell edit zshrc', 'nano ~/.zshrc', 'Edit zsh configuration'],
    ['shell reload shell', 'exec $SHELL', 'Reloads shell config'],
    ['', '', ''],
    ['CRON JOBS (Scheduled Tasks)', '', ''],
    ['shell show cron jobs', 'crontab -l', 'Lists scheduled tasks'],
    ['shell edit cron jobs', 'crontab -e', 'Edit scheduled tasks'],
    ['', '', ''],
    ['UTILITIES', '', ''],
    ['shell watch command <cmd>', 'watch -n 2 <cmd>', 'Repeats every 2 seconds'],
    ['shell repeat 5 echo hello', 'for i in...; do...; done', 'Repeats command N times'],
    ['shell show history', 'history | tail -50', 'Shows recent commands'],
    ['', '', ''],
    ['OUTPUT REDIRECTION', '', ''],
    ['shell save output to file.txt <cmd>', '<cmd> > file.txt', 'Saves output to file'],
    ['shell append output to file.txt <cmd>', '<cmd> >> file.txt', 'Appends to file'],
  ];

  console.log('');
  printTable('SHELL SCRIPTING COMMANDS', headers, rows, colWidths);
  console.log('');

  // Extra tips
  console.log('  CRON SCHEDULE FORMAT:');
  console.log('  ─────────────────────────────────────────────────────────────────');
  console.log('  * * * * *  command');
  console.log('  │ │ │ │ │');
  console.log('  │ │ │ │ └─ Day of week (0-7, 0 and 7 are Sunday)');
  console.log('  │ │ │ └─── Month (1-12)');
  console.log('  │ │ └───── Day of month (1-31)');
  console.log('  │ └─────── Hour (0-23)');
  console.log('  └───────── Minute (0-59)');
  console.log('');
  console.log('  Examples:');
  console.log('    0 * * * *     Every hour');
  console.log('    0 0 * * *     Every day at midnight');
  console.log('    0 0 * * 0     Every Sunday at midnight');
  console.log('    */5 * * * *   Every 5 minutes');
  console.log('');
}

module.exports = {
  executeShell,
  printShellHelp
};
