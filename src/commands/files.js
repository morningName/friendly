const { execSync } = require('child_process');
const { printCommand } = require('../utils/ascii');
const { printTable } = require('../utils/table');
const os = require('os');

// Detect platform
const isWindows = os.platform() === 'win32';

// Cross-platform command mappings
const filesCommands = {
  // Directory listing
  'list': {
    cmd: isWindows ? 'dir' : 'ls',
    desc: 'Lists files in current directory'
  },
  'list all': {
    cmd: isWindows ? 'dir /a' : 'ls -la',
    desc: 'Lists all files including hidden'
  },
  'list detailed': {
    cmd: isWindows ? 'dir' : 'ls -lh',
    desc: 'Lists files with size and details'
  },
  'list tree': {
    cmd: isWindows ? 'tree' : 'find . -type d | head -50',
    desc: 'Shows folder structure as tree'
  },
  'list recent': {
    cmd: isWindows ? 'dir /od' : 'ls -lt | head -20',
    desc: 'Lists recently modified files'
  },
  'list biggest': {
    cmd: isWindows ? 'dir /os' : 'ls -lhS | head -20',
    desc: 'Lists largest files first'
  },

  // Current location
  'where am i': {
    cmd: isWindows ? 'cd' : 'pwd',
    desc: 'Shows current directory path'
  },
  'show current folder': {
    cmd: isWindows ? 'cd' : 'pwd',
    desc: 'Shows current directory path'
  },

  // Disk usage
  'show disk usage': {
    cmd: isWindows ? 'wmic logicaldisk get size,freespace,caption' : 'df -h',
    desc: 'Shows disk space usage'
  },
  'show folder size': {
    cmd: isWindows ? 'dir /s /-c | findstr "File(s)"' : 'du -sh .',
    desc: 'Shows size of current folder'
  },

  // History
  'show history': {
    cmd: isWindows ? 'doskey /history' : 'history',
    desc: 'Shows command history'
  },

  // Clear screen
  'clear': {
    cmd: isWindows ? 'cls' : 'clear',
    desc: 'Clears the terminal screen'
  },
  'clear screen': {
    cmd: isWindows ? 'cls' : 'clear',
    desc: 'Clears the terminal screen'
  },

  // Environment
  'show env': {
    cmd: isWindows ? 'set' : 'env',
    desc: 'Shows all environment variables'
  },
  'show path': {
    cmd: isWindows ? 'echo %PATH%' : 'echo $PATH',
    desc: 'Shows PATH variable'
  },

  // Process
  'show processes': {
    cmd: isWindows ? 'tasklist' : 'ps aux',
    desc: 'Shows all running processes'
  },

  // Network
  'show ip': {
    cmd: isWindows ? 'ipconfig' : 'ifconfig 2>/dev/null || ip addr',
    desc: 'Shows network IP addresses'
  },
  'show ports': {
    cmd: isWindows ? 'netstat -an' : 'netstat -tuln',
    desc: 'Shows open ports'
  },
  'test connection': {
    cmd: isWindows ? 'ping google.com' : 'ping -c 4 google.com',
    desc: 'Tests internet connection'
  },

  // User info
  'whoami': {
    cmd: 'whoami',
    desc: 'Shows current username'
  },
};

// Commands that need arguments - returns platform-specific commands
function getCommandWithArgs(command, args) {
  const argStr = args.join(' ');

  // NAVIGATION
  if (command === 'go to' || command === 'cd') {
    return { cmd: `cd ${argStr}`, desc: `Navigate to ${argStr}` };
  }
  if (command === 'go back') {
    return { cmd: 'cd ..', desc: 'Go to parent directory' };
  }
  if (command === 'go home') {
    return { cmd: isWindows ? 'cd %USERPROFILE%' : 'cd ~', desc: 'Go to home directory' };
  }

  // SEARCHING
  if (command === 'find text' || command === 'search') {
    if (args.length >= 1) {
      const text = argStr;
      return {
        cmd: isWindows ? `findstr /s /i "${text}" *.*` : `grep -r "${text}" .`,
        desc: `Searches for "${text}" in all files`
      };
    }
  }
  if (command === 'find text in') {
    if (args.length >= 2) {
      const text = args[0];
      const folder = args.slice(1).join(' ');
      return {
        cmd: isWindows ? `findstr /s /i "${text}" ${folder}\\*.*` : `grep -r "${text}" ${folder}`,
        desc: `Searches for "${text}" in ${folder}`
      };
    }
  }
  if (command === 'find file' || command === 'find name') {
    if (args.length >= 1) {
      return {
        cmd: isWindows ? `dir /s /b "${argStr}"` : `find . -name "${argStr}"`,
        desc: `Finds files named "${argStr}"`
      };
    }
  }
  if (command === 'find files with extension') {
    if (args.length >= 1) {
      const ext = args[0].startsWith('.') ? args[0] : '.' + args[0];
      return {
        cmd: isWindows ? `dir /s /b *${ext}` : `find . -name "*${ext}"`,
        desc: `Finds all ${ext} files`
      };
    }
  }
  if (command === 'find empty files') {
    return {
      cmd: isWindows ? 'forfiles /s /m *.* /c "cmd /c if @fsize==0 echo @path"' : 'find . -type f -empty',
      desc: 'Finds all empty files'
    };
  }
  if (command === 'find empty folders') {
    return {
      cmd: isWindows ? 'for /f "delims=" %d in (\'dir /s /b /ad ^| sort /r\') do @dir /b /a "%d" | findstr "^" >nul || echo %d' : 'find . -type d -empty',
      desc: 'Finds all empty directories'
    };
  }
  if (command === 'find large files') {
    const size = args[0] || '100M';
    return {
      cmd: isWindows ? `forfiles /s /c "cmd /c if @fsize gtr 104857600 echo @path @fsize"` : `find . -type f -size +${size}`,
      desc: `Finds files larger than ${size}`
    };
  }
  if (command === 'find modified today') {
    return {
      cmd: isWindows ? 'forfiles /s /d +0 /c "cmd /c echo @path"' : 'find . -mtime 0',
      desc: 'Finds files modified today'
    };
  }

  // VIEWING
  if (command === 'show' || command === 'view' || command === 'cat') {
    if (args.length >= 1) {
      return {
        cmd: isWindows ? `type ${argStr}` : `cat ${argStr}`,
        desc: `Shows contents of ${argStr}`
      };
    }
  }
  if (command === 'show first' || command === 'head') {
    if (args.length >= 2) {
      const lines = args[0];
      const file = args.slice(1).join(' ');
      return {
        cmd: isWindows ? `powershell -command "Get-Content ${file} -Head ${lines}"` : `head -n ${lines} ${file}`,
        desc: `Shows first ${lines} lines of ${file}`
      };
    }
    if (args.length === 1) {
      return {
        cmd: isWindows ? `powershell -command "Get-Content ${args[0]} -Head 10"` : `head -n 10 ${args[0]}`,
        desc: `Shows first 10 lines of ${args[0]}`
      };
    }
  }
  if (command === 'show last' || command === 'tail') {
    if (args.length >= 2) {
      const lines = args[0];
      const file = args.slice(1).join(' ');
      return {
        cmd: isWindows ? `powershell -command "Get-Content ${file} -Tail ${lines}"` : `tail -n ${lines} ${file}`,
        desc: `Shows last ${lines} lines of ${file}`
      };
    }
    if (args.length === 1) {
      return {
        cmd: isWindows ? `powershell -command "Get-Content ${args[0]} -Tail 10"` : `tail -n 10 ${args[0]}`,
        desc: `Shows last 10 lines of ${args[0]}`
      };
    }
  }
  if (command === 'show lines') {
    if (args.length >= 2) {
      const range = args[0];
      const file = args.slice(1).join(' ');
      const [start, end] = range.split('-');
      return {
        cmd: isWindows
          ? `powershell -command "Get-Content ${file} | Select-Object -Skip ${parseInt(start)-1} -First ${parseInt(end)-parseInt(start)+1}"`
          : `sed -n '${start},${end}p' ${file}`,
        desc: `Shows lines ${start}-${end} of ${file}`
      };
    }
  }
  if (command === 'watch' || command === 'follow') {
    if (args.length >= 1) {
      return {
        cmd: isWindows ? `powershell -command "Get-Content ${argStr} -Wait"` : `tail -f ${argStr}`,
        desc: `Watches ${argStr} for new content`
      };
    }
  }

  // COUNTING
  if (command === 'count lines' || command === 'count lines in') {
    if (args.length >= 1) {
      return {
        cmd: isWindows ? `find /c /v "" ${argStr}` : `wc -l ${argStr}`,
        desc: `Counts lines in ${argStr}`
      };
    }
  }
  if (command === 'count words' || command === 'count words in') {
    if (args.length >= 1) {
      return {
        cmd: isWindows
          ? `powershell -command "(Get-Content ${argStr} | Measure-Object -Word).Words"`
          : `wc -w ${argStr}`,
        desc: `Counts words in ${argStr}`
      };
    }
  }
  if (command === 'count files') {
    return {
      cmd: isWindows ? 'dir /a-d /s /b | find /c /v ""' : 'find . -type f | wc -l',
      desc: 'Counts all files in directory'
    };
  }
  if (command === 'count folders') {
    return {
      cmd: isWindows ? 'dir /ad /s /b | find /c /v ""' : 'find . -type d | wc -l',
      desc: 'Counts all folders in directory'
    };
  }

  // FILE OPERATIONS
  if (command === 'create file' || command === 'touch') {
    if (args.length >= 1) {
      return {
        cmd: isWindows ? `type nul > ${argStr}` : `touch ${argStr}`,
        desc: `Creates empty file ${argStr}`
      };
    }
  }
  if (command === 'create folder' || command === 'mkdir') {
    if (args.length >= 1) {
      return {
        cmd: isWindows ? `mkdir ${argStr}` : `mkdir -p ${argStr}`,
        desc: `Creates folder ${argStr}`
      };
    }
  }
  if (command === 'copy') {
    if (args.length >= 2) {
      const source = args[0];
      const dest = args.slice(1).join(' ');
      return {
        cmd: isWindows ? `xcopy /s /e /i ${source} ${dest}` : `cp -r ${source} ${dest}`,
        desc: `Copies ${source} to ${dest}`
      };
    }
  }
  if (command === 'move' || command === 'rename') {
    if (args.length >= 2) {
      const source = args[0];
      const dest = args.slice(1).join(' ');
      return {
        cmd: isWindows ? `move ${source} ${dest}` : `mv ${source} ${dest}`,
        desc: `Moves ${source} to ${dest}`
      };
    }
  }
  if (command === 'delete file' || command === 'remove file') {
    if (args.length >= 1) {
      return {
        cmd: isWindows ? `del ${argStr}` : `rm ${argStr}`,
        desc: `Deletes file ${argStr}`
      };
    }
  }
  if (command === 'delete folder' || command === 'remove folder') {
    if (args.length >= 1) {
      return {
        cmd: isWindows ? `rmdir /s /q ${argStr}` : `rm -rf ${argStr}`,
        desc: `Deletes folder ${argStr} and contents`
      };
    }
  }

  // PERMISSIONS (Unix only, show message for Windows)
  if (command === 'make executable') {
    if (args.length >= 1) {
      return {
        cmd: isWindows ? `echo Windows doesn't use executable permissions like Unix` : `chmod +x ${argStr}`,
        desc: `Makes ${argStr} executable`
      };
    }
  }
  if (command === 'show permissions') {
    if (args.length >= 1) {
      return {
        cmd: isWindows ? `icacls ${argStr}` : `ls -la ${argStr}`,
        desc: `Shows permissions for ${argStr}`
      };
    }
  }

  // TEXT PROCESSING
  if (command === 'replace' || command === 'find and replace') {
    if (args.length >= 3) {
      const oldText = args[0];
      const newText = args[1];
      const file = args.slice(2).join(' ');
      return {
        cmd: isWindows
          ? `powershell -command "(Get-Content ${file}) -replace '${oldText}','${newText}' | Set-Content ${file}"`
          : `sed -i 's/${oldText}/${newText}/g' ${file}`,
        desc: `Replaces "${oldText}" with "${newText}" in ${file}`
      };
    }
  }
  if (command === 'sort') {
    if (args.length >= 1) {
      return {
        cmd: isWindows ? `sort ${argStr}` : `sort ${argStr}`,
        desc: `Sorts lines in ${argStr}`
      };
    }
  }
  if (command === 'unique' || command === 'remove duplicates') {
    if (args.length >= 1) {
      return {
        cmd: isWindows
          ? `powershell -command "Get-Content ${argStr} | Sort-Object | Get-Unique"`
          : `sort ${argStr} | uniq`,
        desc: `Shows unique lines in ${argStr}`
      };
    }
  }
  if (command === 'filter' || command === 'grep') {
    if (args.length >= 2) {
      const pattern = args[0];
      const file = args.slice(1).join(' ');
      return {
        cmd: isWindows ? `findstr "${pattern}" ${file}` : `grep "${pattern}" ${file}`,
        desc: `Filters lines matching "${pattern}"`
      };
    }
  }

  // COMPRESSION
  if (command === 'zip' || command === 'compress') {
    if (args.length >= 2) {
      const zipName = args[0];
      const files = args.slice(1).join(' ');
      return {
        cmd: isWindows
          ? `powershell -command "Compress-Archive -Path ${files} -DestinationPath ${zipName}"`
          : `zip -r ${zipName} ${files}`,
        desc: `Creates ${zipName} from ${files}`
      };
    }
  }
  if (command === 'unzip' || command === 'extract') {
    if (args.length >= 1) {
      return {
        cmd: isWindows
          ? `powershell -command "Expand-Archive -Path ${argStr} -DestinationPath ."`
          : `unzip ${argStr}`,
        desc: `Extracts ${argStr}`
      };
    }
  }
  if (command === 'tar create') {
    if (args.length >= 2) {
      const tarName = args[0];
      const files = args.slice(1).join(' ');
      return {
        cmd: isWindows
          ? `tar -czvf ${tarName} ${files}`
          : `tar -czvf ${tarName} ${files}`,
        desc: `Creates tar.gz from ${files}`
      };
    }
  }
  if (command === 'tar extract') {
    if (args.length >= 1) {
      return {
        cmd: `tar -xzvf ${argStr}`,
        desc: `Extracts tar.gz file`
      };
    }
  }

  // DOWNLOAD
  if (command === 'download') {
    if (args.length >= 1) {
      return {
        cmd: isWindows
          ? `powershell -command "Invoke-WebRequest -Uri ${argStr} -OutFile (Split-Path ${argStr} -Leaf)"`
          : `curl -O ${argStr}`,
        desc: `Downloads file from ${argStr}`
      };
    }
  }
  if (command === 'download as') {
    if (args.length >= 2) {
      const filename = args[0];
      const url = args.slice(1).join(' ');
      return {
        cmd: isWindows
          ? `powershell -command "Invoke-WebRequest -Uri ${url} -OutFile ${filename}"`
          : `curl -o ${filename} ${url}`,
        desc: `Downloads and saves as ${filename}`
      };
    }
  }

  // PROCESS
  if (command === 'kill' || command === 'stop process') {
    if (args.length >= 1) {
      return {
        cmd: isWindows ? `taskkill /PID ${argStr}` : `kill ${argStr}`,
        desc: `Stops process ${argStr}`
      };
    }
  }
  if (command === 'kill force') {
    if (args.length >= 1) {
      return {
        cmd: isWindows ? `taskkill /F /PID ${argStr}` : `kill -9 ${argStr}`,
        desc: `Force stops process ${argStr}`
      };
    }
  }
  if (command === 'find process') {
    if (args.length >= 1) {
      return {
        cmd: isWindows ? `tasklist | findstr ${argStr}` : `ps aux | grep ${argStr}`,
        desc: `Finds processes matching ${argStr}`
      };
    }
  }
  if (command === 'kill by name') {
    if (args.length >= 1) {
      return {
        cmd: isWindows ? `taskkill /IM ${argStr} /F` : `pkill ${argStr}`,
        desc: `Kills all processes named ${argStr}`
      };
    }
  }

  // OPEN IN EDITOR
  if (command === 'edit' || command === 'open') {
    if (args.length >= 1) {
      const editor = isWindows ? 'notepad' : (process.env.EDITOR || 'nano');
      return { cmd: `${editor} ${argStr}`, desc: `Opens ${argStr} in editor` };
    }
  }

  return null;
}

function executeFiles(args) {
  const fullCommand = args.join(' ').trim();

  // Check for help
  if (fullCommand === 'help' || fullCommand === '') {
    return printFilesHelp();
  }

  // Check exact matches first
  if (filesCommands[fullCommand]) {
    const { cmd } = filesCommands[fullCommand];
    return runCommand(cmd);
  }

  // Check commands with arguments
  const patterns = [
    'go to', 'go back', 'go home', 'cd',
    'find text in', 'find text', 'search',
    'find file', 'find name', 'find files with extension',
    'find empty files', 'find empty folders', 'find large files',
    'find modified today',
    'show first', 'show last', 'show lines', 'show', 'view', 'cat', 'head', 'tail',
    'watch', 'follow',
    'count lines in', 'count lines', 'count words in', 'count words', 'count files', 'count folders',
    'create file', 'create folder', 'touch', 'mkdir',
    'copy', 'move', 'rename',
    'delete file', 'delete folder', 'remove file', 'remove folder',
    'make executable', 'show permissions',
    'find and replace', 'replace', 'sort', 'unique', 'remove duplicates', 'filter', 'grep',
    'zip', 'compress', 'unzip', 'extract', 'tar create', 'tar extract',
    'download as', 'download',
    'kill force', 'kill by name', 'kill', 'stop process', 'find process',
    'edit', 'open'
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

  console.log('Unknown files command: ' + fullCommand);
  console.log('Type "files help" to see available commands.');
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

function printFilesHelp() {
  const headers = ['Friendly Command', 'Unix (Mac/Linux)', 'Windows', 'What It Does'];
  const colWidths = [30, 26, 22, 30];

  const rows = [
    ['LISTING FILES', '', '', ''],
    ['files list', 'ls', 'dir', 'Shows files in folder'],
    ['files list all', 'ls -la', 'dir /a', 'Shows all files + hidden'],
    ['files list detailed', 'ls -lh', 'dir', 'Shows files with sizes'],
    ['files list tree', 'find . -type d', 'tree', 'Shows folder structure'],
    ['', '', '', ''],
    ['NAVIGATION', '', '', ''],
    ['files go to <folder>', 'cd <folder>', 'cd <folder>', 'Enter a folder'],
    ['files go back', 'cd ..', 'cd ..', 'Go to parent folder'],
    ['files go home', 'cd ~', 'cd %USERPROFILE%', 'Go to home directory'],
    ['files where am i', 'pwd', 'cd', 'Shows current location'],
    ['', '', '', ''],
    ['SEARCHING', '', '', ''],
    ['files find text "hello"', 'grep -r "hello" .', 'findstr /s "hello"', 'Search text in files'],
    ['files find file app.js', 'find . -name "..."', 'dir /s /b "..."', 'Find file by name'],
    ['files find files with ext js', 'find . -name "*.js"', 'dir /s /b *.js', 'Find by extension'],
    ['', '', '', ''],
    ['VIEWING FILES', '', '', ''],
    ['files show app.js', 'cat app.js', 'type app.js', 'Display file contents'],
    ['files show first 20 app.js', 'head -n 20', 'Get-Content -Head', 'Show first N lines'],
    ['files show last 20 app.js', 'tail -n 20', 'Get-Content -Tail', 'Show last N lines'],
    ['files watch log.txt', 'tail -f', 'Get-Content -Wait', 'Watch file for changes'],
    ['', '', '', ''],
    ['COUNTING', '', '', ''],
    ['files count lines app.js', 'wc -l app.js', 'find /c /v ""', 'Count lines in file'],
    ['files count files', 'find | wc -l', 'dir /s /b | find /c', 'Count all files'],
    ['', '', '', ''],
    ['FILE OPERATIONS', '', '', ''],
    ['files create file app.js', 'touch app.js', 'type nul > app.js', 'Create empty file'],
    ['files create folder src', 'mkdir -p src', 'mkdir src', 'Create new folder'],
    ['files copy a.txt b.txt', 'cp -r a.txt b.txt', 'xcopy /s /e', 'Copy file or folder'],
    ['files move a.txt folder/', 'mv a.txt folder/', 'move a.txt folder/', 'Move or rename'],
    ['files delete file app.js', 'rm app.js', 'del app.js', 'Delete a file'],
    ['files delete folder src', 'rm -rf src', 'rmdir /s /q src', 'Delete folder + contents'],
    ['', '', '', ''],
    ['PERMISSIONS', '', '', ''],
    ['files make executable run.sh', 'chmod +x run.sh', '(N/A on Windows)', 'Make script runnable'],
    ['files show permissions file', 'ls -la file', 'icacls file', 'View file permissions'],
    ['', '', '', ''],
    ['TEXT PROCESSING', '', '', ''],
    ['files replace old new file', 'sed -i \'s/.../g\'', 'PowerShell -replace', 'Find and replace text'],
    ['files sort names.txt', 'sort names.txt', 'sort names.txt', 'Sort lines A-Z'],
    ['files filter "err" log.txt', 'grep "err"', 'findstr "err"', 'Filter matching lines'],
    ['', '', '', ''],
    ['COMPRESSION', '', '', ''],
    ['files zip out.zip folder/', 'zip -r out.zip', 'Compress-Archive', 'Create zip archive'],
    ['files unzip archive.zip', 'unzip archive.zip', 'Expand-Archive', 'Extract zip archive'],
    ['files tar create backup.tar.gz', 'tar -czvf', 'tar -czvf', 'Create tar.gz archive'],
    ['files tar extract backup.tar.gz', 'tar -xzvf', 'tar -xzvf', 'Extract tar.gz archive'],
    ['', '', '', ''],
    ['DOWNLOAD', '', '', ''],
    ['files download <url>', 'curl -O <url>', 'Invoke-WebRequest', 'Download file from URL'],
    ['', '', '', ''],
    ['PROCESSES', '', '', ''],
    ['files show processes', 'ps aux', 'tasklist', 'List running programs'],
    ['files find process node', 'ps aux | grep', 'tasklist | findstr', 'Find specific process'],
    ['files kill 1234', 'kill 1234', 'taskkill /PID 1234', 'Stop process by ID'],
    ['files kill by name node', 'pkill node', 'taskkill /IM node /F', 'Stop process by name'],
    ['', '', '', ''],
    ['NETWORK', '', '', ''],
    ['files show ip', 'ifconfig / ip addr', 'ipconfig', 'Show IP addresses'],
    ['files show ports', 'netstat -tuln', 'netstat -an', 'Show open ports'],
    ['files test connection', 'ping -c 4 google', 'ping google.com', 'Test internet connection'],
    ['', '', '', ''],
    ['SYSTEM', '', '', ''],
    ['files show env', 'env', 'set', 'Show environment vars'],
    ['files show path', 'echo $PATH', 'echo %PATH%', 'Show PATH variable'],
    ['files clear', 'clear', 'cls', 'Clear the screen'],
  ];

  console.log('');
  printTable('FILES & TERMINAL COMMANDS (Cross-Platform)', headers, rows, colWidths);
  console.log('');
  console.log('  Note: Commands automatically use the correct syntax for your OS!');
  console.log('  Current OS: ' + (isWindows ? 'Windows' : 'Unix (Mac/Linux)'));
  console.log('');
}

module.exports = {
  executeFiles,
  printFilesHelp
};
