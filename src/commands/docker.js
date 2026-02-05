const { execSync } = require('child_process');
const { printCommand } = require('../utils/ascii');
const { printTable } = require('../utils/table');

// Docker command mappings
const dockerCommands = {
  'show containers': { cmd: 'docker ps', desc: 'Shows all running containers' },
  'show all containers': { cmd: 'docker ps -a', desc: 'Shows all containers including stopped ones' },
  'show images': { cmd: 'docker images', desc: 'Shows all downloaded images' },
  'build': { cmd: 'docker build -t myapp .', desc: 'Builds an image from Dockerfile in current folder' },
};

// Commands that need arguments
const dockerCommandsWithArgs = {
  'show logs': (container) => {
    if (container.includes('follow')) {
      const name = container.replace('follow', '').trim();
      return { cmd: `docker logs -f ${name}`, desc: `Shows and follows logs from ${name}` };
    }
    return { cmd: `docker logs ${container}`, desc: `Shows output logs from ${container}` };
  },
  'run': (args) => {
    const parts = args.split(' ');
    const image = parts[0];
    if (args.includes('detach')) {
      return { cmd: `docker run -d ${image}`, desc: `Runs ${image} in background` };
    }
    if (args.includes('port')) {
      const portIndex = parts.indexOf('port');
      const portMapping = parts[portIndex + 1];
      return { cmd: `docker run -p ${portMapping} ${image}`, desc: `Runs ${image} with port ${portMapping}` };
    }
    return { cmd: `docker run ${image}`, desc: `Creates and starts a container from ${image}` };
  },
  'start': (container) => ({ cmd: `docker start ${container}`, desc: `Starts ${container}` }),
  'stop': (container) => ({ cmd: `docker stop ${container}`, desc: `Stops ${container}` }),
  'restart': (container) => ({ cmd: `docker restart ${container}`, desc: `Restarts ${container}` }),
  'remove': (args) => {
    if (args.startsWith('image ')) {
      const image = args.replace('image ', '');
      return { cmd: `docker rmi ${image}`, desc: `Deletes image ${image}` };
    }
    return { cmd: `docker rm ${args}`, desc: `Deletes container ${args}` };
  },
  'build tag': (tag) => ({ cmd: `docker build -t ${tag} .`, desc: `Builds image with tag ${tag}` }),
  'exec': (args) => {
    const parts = args.split(' ');
    const container = parts[0];
    const command = parts.slice(1).join(' ') || 'bash';
    return { cmd: `docker exec -it ${container} ${command}`, desc: `Opens ${command} inside ${container}` };
  },
};

function executeDocker(args) {
  const fullCommand = args.join(' ').trim();

  // Check for help
  if (fullCommand === 'help' || fullCommand === '') {
    return printDockerHelp();
  }

  // Check exact matches first
  if (dockerCommands[fullCommand]) {
    const { cmd } = dockerCommands[fullCommand];
    return runCommand(cmd);
  }

  // Check commands with arguments
  for (const [pattern, handler] of Object.entries(dockerCommandsWithArgs)) {
    if (fullCommand.startsWith(pattern + ' ') || fullCommand === pattern) {
      const arg = fullCommand.slice(pattern.length).trim();
      if (arg) {
        const { cmd } = handler(arg);
        return runCommand(cmd);
      }
    }
  }

  // Not found - pass through to real docker
  printCommand('docker ' + fullCommand);
  try {
    execSync('docker ' + fullCommand, { encoding: 'utf-8', stdio: 'inherit' });
  } catch (e) {
    // docker already printed the error
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

function printDockerHelp() {
  const headers = ['Friendly Command', 'Actual Command', 'What It Does'];
  const colWidths = [35, 35, 45];

  const rows = [
    ['SHOWING INFORMATION', '', ''],
    ['docker show containers', 'docker ps', 'Shows all running containers'],
    ['docker show all containers', 'docker ps -a', 'Shows all containers including stopped ones'],
    ['docker show images', 'docker images', 'Shows all downloaded images'],
    ['docker show logs <name>', 'docker logs <name>', 'Shows output logs from a container'],
    ['docker show logs <name> follow', 'docker logs -f <name>', 'Shows logs and keeps following new output'],
    ['', '', ''],
    ['RUNNING', '', ''],
    ['docker run <image>', 'docker run <image>', 'Creates and starts a container from an image'],
    ['docker run <image> detach', 'docker run -d <image>', 'Runs container in background (detached)'],
    ['docker run <image> port 8080:80', 'docker run -p 8080:80 <image>', 'Runs container with port mapping'],
    ['', '', ''],
    ['MANAGING', '', ''],
    ['docker start <name>', 'docker start <name>', 'Starts a stopped container'],
    ['docker stop <name>', 'docker stop <name>', 'Stops a running container'],
    ['docker restart <name>', 'docker restart <name>', 'Stops and starts a container'],
    ['docker remove <name>', 'docker rm <name>', 'Deletes a stopped container'],
    ['docker remove image <name>', 'docker rmi <name>', 'Deletes a downloaded image'],
    ['', '', ''],
    ['BUILDING', '', ''],
    ['docker build', 'docker build -t myapp .', 'Builds an image from Dockerfile'],
    ['docker build tag <tag>', 'docker build -t <tag> .', 'Builds an image with a specific tag'],
    ['', '', ''],
    ['EXECUTING', '', ''],
    ['docker exec <name> bash', 'docker exec -it <name> bash', 'Opens a shell inside a running container'],
  ];

  console.log('');
  printTable('DOCKER COMMANDS', headers, rows, colWidths);
  console.log('');
}

module.exports = {
  executeDocker,
  printDockerHelp
};
