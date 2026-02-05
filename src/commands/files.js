const { execSync } = require('child_process');
const { printCommand } = require('../utils/ascii');
const { printTable } = require('../utils/table');

// Commands that need arguments
const filesCommandsWithArgs = {
  'find': (args) => {
    if (args.startsWith('name ')) {
      const name = args.replace('name ', '');
      return { cmd: `find . -name "${name}"`, desc: `Finds files named ${name}` };
    }
    if (args.includes(' in ')) {
      const [text, folder] = args.split(' in ');
      return { cmd: `grep -r "${text.replace(/"/g, '')}" ./${folder}`, desc: `Searches for ${text} in ${folder}` };
    }
    return { cmd: `grep -r "${args.replace(/"/g, '')}" .`, desc: 'Searches for text in all files' };
  },
  'show': (args) => {
    if (args.includes(' lines ')) {
      const [file, range] = args.split(' lines ');
      const [start, end] = range.split('-');
      return { cmd: `sed -n '${start},${end}p' ${file}`, desc: `Shows lines ${start}-${end} of ${file}` };
    }
    return { cmd: `cat ${args}`, desc: `Displays contents of ${args}` };
  },
  'open': (file) => {
    const editor = process.env.EDITOR || 'nano';
    return { cmd: `${editor} ${file}`, desc: `Opens ${file} in your editor` };
  },
  'count lines': (file) => ({ cmd: `wc -l ${file}`, desc: `Counts lines in ${file}` }),
};

function executeFiles(args) {
  const fullCommand = args.join(' ').trim();

  // Check for help
  if (fullCommand === 'help' || fullCommand === '') {
    return printFilesHelp();
  }

  // Check commands with arguments
  for (const [pattern, handler] of Object.entries(filesCommandsWithArgs)) {
    if (fullCommand.startsWith(pattern + ' ') || fullCommand === pattern) {
      const arg = fullCommand.slice(pattern.length).trim();
      if (arg) {
        const { cmd } = handler(arg);
        return runCommand(cmd);
      }
    }
  }

  console.log('Unknown files command: ' + fullCommand);
  console.log('Type "files help" to see available commands.');
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

function printFilesHelp() {
  const headers = ['Friendly Command', 'Actual Command', 'What It Does'];
  const colWidths = [35, 35, 45];

  const rows = [
    ['SEARCHING', '', ''],
    ['files find "text"', 'grep -r "text" .', 'Searches for text inside all files'],
    ['files find "text" in src', 'grep -r "text" ./src', 'Searches for text inside a specific folder'],
    ['files find name app.js', 'find . -name "app.js"', 'Finds files by name'],
    ['files find name "*.js"', 'find . -name "*.js"', 'Finds files matching a pattern'],
    ['', '', ''],
    ['VIEWING', '', ''],
    ['files show app.js', 'cat app.js', 'Displays the contents of a file'],
    ['files show app.js lines 1-20', 'sed -n \'1,20p\' app.js', 'Shows specific lines of a file'],
    ['files count lines app.js', 'wc -l app.js', 'Counts the number of lines in a file'],
    ['', '', ''],
    ['EDITING', '', ''],
    ['files open app.js', '$EDITOR app.js', 'Opens the file in your default editor'],
  ];

  console.log('');
  printTable('FILES COMMANDS', headers, rows, colWidths);
  console.log('');
}

module.exports = {
  executeFiles,
  printFilesHelp
};
