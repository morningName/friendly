const { execSync } = require('child_process');
const { printCommand } = require('../utils/ascii');
const { printTable } = require('../utils/table');

// Docker command mappings
const dockerCommands = {
  // Showing Information
  'show containers': { cmd: 'docker ps', desc: 'Shows all running containers' },
  'show all containers': { cmd: 'docker ps -a', desc: 'Shows all containers including stopped ones' },
  'show images': { cmd: 'docker images', desc: 'Shows all downloaded images' },
  'show networks': { cmd: 'docker network ls', desc: 'Shows all Docker networks' },
  'show volumes': { cmd: 'docker volume ls', desc: 'Shows all Docker volumes' },
  'show disk usage': { cmd: 'docker system df', desc: 'Shows Docker disk space usage' },
  'show running': { cmd: 'docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"', desc: 'Shows running containers (clean format)' },

  // Cleanup
  'cleanup': { cmd: 'docker system prune -f', desc: 'Removes unused containers, networks, images' },
  'cleanup all': { cmd: 'docker system prune -a -f', desc: 'Removes everything unused (including images)' },
  'cleanup volumes': { cmd: 'docker volume prune -f', desc: 'Removes all unused volumes' },
  'cleanup images': { cmd: 'docker image prune -a -f', desc: 'Removes all unused images' },

  // Stop all
  'stop all': { cmd: 'docker stop $(docker ps -q)', desc: 'Stops all running containers' },
  'remove all containers': { cmd: 'docker rm $(docker ps -a -q)', desc: 'Removes all stopped containers' },
  'remove all images': { cmd: 'docker rmi $(docker images -q)', desc: 'Removes all images' },

  // Docker Compose
  'compose up': { cmd: 'docker-compose up', desc: 'Starts all services defined in docker-compose.yml' },
  'compose up detach': { cmd: 'docker-compose up -d', desc: 'Starts services in background' },
  'compose up build': { cmd: 'docker-compose up --build', desc: 'Rebuilds and starts services' },
  'compose down': { cmd: 'docker-compose down', desc: 'Stops and removes all services' },
  'compose down volumes': { cmd: 'docker-compose down -v', desc: 'Stops services and removes volumes' },
  'compose restart': { cmd: 'docker-compose restart', desc: 'Restarts all services' },
  'compose logs': { cmd: 'docker-compose logs', desc: 'Shows logs from all services' },
  'compose logs follow': { cmd: 'docker-compose logs -f', desc: 'Shows and follows logs from all services' },
  'compose ps': { cmd: 'docker-compose ps', desc: 'Shows status of compose services' },
  'compose build': { cmd: 'docker-compose build', desc: 'Builds all services' },
  'compose pull': { cmd: 'docker-compose pull', desc: 'Pulls latest images for services' },
};

// Commands that need arguments
const dockerCommandsWithArgs = {
  // Logs
  'show logs': (container) => {
    if (container.includes('follow')) {
      const name = container.replace('follow', '').trim();
      return { cmd: `docker logs -f ${name}`, desc: `Shows and follows logs from ${name}` };
    }
    return { cmd: `docker logs ${container}`, desc: `Shows output logs from ${container}` };
  },
  'logs': (container) => {
    if (container.includes('follow')) {
      const name = container.replace('follow', '').trim();
      return { cmd: `docker logs -f ${name}`, desc: `Shows and follows logs from ${name}` };
    }
    return { cmd: `docker logs ${container}`, desc: `Shows output logs from ${container}` };
  },
  'follow': (container) => ({ cmd: `docker logs -f ${container}`, desc: `Follows logs from ${container}` }),

  // Running containers
  'run': (args) => {
    const parts = args.split(' ');
    const image = parts[0];
    if (args.includes('detach') || args.includes('background')) {
      return { cmd: `docker run -d ${image}`, desc: `Runs ${image} in background` };
    }
    if (args.includes('interactive')) {
      return { cmd: `docker run -it ${image}`, desc: `Runs ${image} interactively` };
    }
    if (args.includes('port')) {
      const portIndex = parts.indexOf('port');
      const portMapping = parts[portIndex + 1];
      return { cmd: `docker run -p ${portMapping} ${image}`, desc: `Runs ${image} with port ${portMapping}` };
    }
    if (args.includes('name')) {
      const nameIndex = parts.indexOf('name');
      const name = parts[nameIndex + 1];
      return { cmd: `docker run --name ${name} ${image}`, desc: `Runs ${image} with name ${name}` };
    }
    return { cmd: `docker run ${image}`, desc: `Creates and starts a container from ${image}` };
  },

  // Container lifecycle
  'start': (container) => ({ cmd: `docker start ${container}`, desc: `Starts stopped container ${container}` }),
  'stop': (container) => ({ cmd: `docker stop ${container}`, desc: `Gracefully stops ${container}` }),
  'kill': (container) => ({ cmd: `docker kill ${container}`, desc: `Force stops ${container} immediately` }),
  'restart': (container) => ({ cmd: `docker restart ${container}`, desc: `Restarts ${container}` }),
  'pause': (container) => ({ cmd: `docker pause ${container}`, desc: `Pauses ${container} (freezes processes)` }),
  'unpause': (container) => ({ cmd: `docker unpause ${container}`, desc: `Unpauses ${container}` }),
  'resume': (container) => ({ cmd: `docker unpause ${container}`, desc: `Resumes paused ${container}` }),

  // Removing
  'remove': (args) => {
    if (args.startsWith('image ')) {
      const image = args.replace('image ', '');
      return { cmd: `docker rmi ${image}`, desc: `Deletes image ${image}` };
    }
    if (args.startsWith('volume ')) {
      const volume = args.replace('volume ', '');
      return { cmd: `docker volume rm ${volume}`, desc: `Deletes volume ${volume}` };
    }
    if (args.startsWith('network ')) {
      const network = args.replace('network ', '');
      return { cmd: `docker network rm ${network}`, desc: `Deletes network ${network}` };
    }
    return { cmd: `docker rm ${args}`, desc: `Deletes container ${args}` };
  },
  'delete': (args) => {
    if (args.startsWith('image ')) {
      const image = args.replace('image ', '');
      return { cmd: `docker rmi ${image}`, desc: `Deletes image ${image}` };
    }
    return { cmd: `docker rm ${args}`, desc: `Deletes container ${args}` };
  },

  // Building
  'build': (args) => {
    if (!args || args === '.') {
      return { cmd: 'docker build -t myapp .', desc: 'Builds image from Dockerfile' };
    }
    return { cmd: `docker build -t ${args} .`, desc: `Builds image with tag ${args}` };
  },
  'build tag': (tag) => ({ cmd: `docker build -t ${tag} .`, desc: `Builds image with tag ${tag}` }),

  // INTERACTIVE ACCESS - The main feature!
  'terminal': (container) => ({
    cmd: `docker exec -it ${container} /bin/bash || docker exec -it ${container} /bin/sh`,
    desc: `Opens terminal inside ${container}`
  }),
  'connect': (container) => ({
    cmd: `docker exec -it ${container} /bin/bash || docker exec -it ${container} /bin/sh`,
    desc: `Connects to ${container} interactively`
  }),
  'shell': (container) => ({
    cmd: `docker exec -it ${container} /bin/bash || docker exec -it ${container} /bin/sh`,
    desc: `Opens shell inside ${container}`
  }),
  'enter': (container) => ({
    cmd: `docker exec -it ${container} /bin/bash || docker exec -it ${container} /bin/sh`,
    desc: `Enters ${container} with interactive shell`
  }),
  'bash': (container) => ({
    cmd: `docker exec -it ${container} /bin/bash`,
    desc: `Opens bash shell in ${container}`
  }),
  'sh': (container) => ({
    cmd: `docker exec -it ${container} /bin/sh`,
    desc: `Opens sh shell in ${container}`
  }),

  // Execute commands
  'exec': (args) => {
    const parts = args.split(' ');
    const container = parts[0];
    const command = parts.slice(1).join(' ') || 'bash';
    return { cmd: `docker exec -it ${container} ${command}`, desc: `Runs ${command} inside ${container}` };
  },
  'run command': (args) => {
    const parts = args.split(' ');
    const container = parts[0];
    const command = parts.slice(1).join(' ');
    return { cmd: `docker exec ${container} ${command}`, desc: `Runs command in ${container}` };
  },

  // Inspect
  'inspect': (name) => ({ cmd: `docker inspect ${name}`, desc: `Shows detailed info about ${name}` }),
  'info': (container) => ({ cmd: `docker inspect ${container} --format '{{json .}}'`, desc: `Shows info about ${container}` }),
  'ip': (container) => ({
    cmd: `docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${container}`,
    desc: `Shows IP address of ${container}`
  }),
  'ports': (container) => ({ cmd: `docker port ${container}`, desc: `Shows port mappings for ${container}` }),
  'top': (container) => ({ cmd: `docker top ${container}`, desc: `Shows processes running in ${container}` }),
  'stats': (container) => ({ cmd: `docker stats ${container} --no-stream`, desc: `Shows resource usage of ${container}` }),

  // Copy files
  'copy from': (args) => {
    const parts = args.split(' ');
    if (parts.length >= 2) {
      const containerPath = parts[0];
      const hostPath = parts[1] || '.';
      return { cmd: `docker cp ${containerPath} ${hostPath}`, desc: `Copies from container to host` };
    }
    return { cmd: `docker cp ${args} .`, desc: `Copies from container to current folder` };
  },
  'copy to': (args) => {
    const parts = args.split(' ');
    if (parts.length >= 2) {
      const hostPath = parts[0];
      const containerPath = parts[1];
      return { cmd: `docker cp ${hostPath} ${containerPath}`, desc: `Copies from host to container` };
    }
    return null;
  },

  // Images
  'pull': (image) => ({ cmd: `docker pull ${image}`, desc: `Downloads ${image} from registry` }),
  'push': (image) => ({ cmd: `docker push ${image}`, desc: `Uploads ${image} to registry` }),
  'tag': (args) => {
    const parts = args.split(' ');
    if (parts.length >= 2) {
      return { cmd: `docker tag ${parts[0]} ${parts[1]}`, desc: `Tags image ${parts[0]} as ${parts[1]}` };
    }
    return null;
  },
  'history': (image) => ({ cmd: `docker history ${image}`, desc: `Shows layers/history of ${image}` }),

  // Networks
  'create network': (name) => ({ cmd: `docker network create ${name}`, desc: `Creates network ${name}` }),
  'connect network': (args) => {
    const parts = args.split(' ');
    if (parts.length >= 2) {
      return { cmd: `docker network connect ${parts[0]} ${parts[1]}`, desc: `Connects ${parts[1]} to network ${parts[0]}` };
    }
    return null;
  },

  // Volumes
  'create volume': (name) => ({ cmd: `docker volume create ${name}`, desc: `Creates volume ${name}` }),

  // Compose with service
  'compose logs service': (service) => ({ cmd: `docker-compose logs ${service}`, desc: `Shows logs for ${service}` }),
  'compose restart service': (service) => ({ cmd: `docker-compose restart ${service}`, desc: `Restarts ${service}` }),
  'compose stop service': (service) => ({ cmd: `docker-compose stop ${service}`, desc: `Stops ${service}` }),
  'compose start service': (service) => ({ cmd: `docker-compose start ${service}`, desc: `Starts ${service}` }),

  // Rename
  'rename': (args) => {
    const parts = args.split(' ');
    if (parts.length >= 2) {
      return { cmd: `docker rename ${parts[0]} ${parts[1]}`, desc: `Renames container to ${parts[1]}` };
    }
    return null;
  },

  // Wait
  'wait': (container) => ({ cmd: `docker wait ${container}`, desc: `Waits for ${container} to stop` }),

  // Diff
  'diff': (container) => ({ cmd: `docker diff ${container}`, desc: `Shows filesystem changes in ${container}` }),
  'changes': (container) => ({ cmd: `docker diff ${container}`, desc: `Shows what files changed in ${container}` }),

  // Commit (save container as image)
  'save as image': (args) => {
    const parts = args.split(' ');
    if (parts.length >= 2) {
      return { cmd: `docker commit ${parts[0]} ${parts[1]}`, desc: `Saves ${parts[0]} as image ${parts[1]}` };
    }
    return null;
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
  const patterns = [
    'show logs', 'logs', 'follow',
    'run',
    'start', 'stop', 'kill', 'restart', 'pause', 'unpause', 'resume',
    'remove', 'delete',
    'build tag', 'build',
    'terminal', 'connect', 'shell', 'enter', 'bash', 'sh',
    'exec', 'run command',
    'inspect', 'info', 'ip', 'ports', 'top', 'stats',
    'copy from', 'copy to',
    'pull', 'push', 'tag', 'history',
    'create network', 'connect network', 'create volume',
    'compose logs service', 'compose restart service', 'compose stop service', 'compose start service',
    'rename', 'wait', 'diff', 'changes', 'save as image'
  ];

  for (const pattern of patterns) {
    if (fullCommand.startsWith(pattern + ' ') || fullCommand === pattern) {
      const arg = fullCommand.slice(pattern.length).trim();
      if (arg && dockerCommandsWithArgs[pattern]) {
        const result = dockerCommandsWithArgs[pattern](arg);
        if (result) {
          return runCommand(result.cmd);
        }
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
    execSync(cmd, { encoding: 'utf-8', stdio: 'inherit', shell: true });
    console.log('');
  } catch (e) {
    // Command already printed error
  }
}

function printDockerHelp() {
  const headers = ['Friendly Command', 'Actual Command', 'What It Does'];
  const colWidths = [38, 38, 44];

  const rows = [
    ['VIEWING', '', ''],
    ['docker show containers', 'docker ps', 'Shows running containers'],
    ['docker show all containers', 'docker ps -a', 'Shows all containers (including stopped)'],
    ['docker show images', 'docker images', 'Shows downloaded images'],
    ['docker show networks', 'docker network ls', 'Shows Docker networks'],
    ['docker show volumes', 'docker volume ls', 'Shows Docker volumes'],
    ['docker show disk usage', 'docker system df', 'Shows disk space used by Docker'],
    ['', '', ''],
    ['LOGS', '', ''],
    ['docker logs <name>', 'docker logs <name>', 'Shows container output'],
    ['docker logs <name> follow', 'docker logs -f <name>', 'Shows logs and keeps following'],
    ['docker follow <name>', 'docker logs -f <name>', 'Follows container logs live'],
    ['', '', ''],
    ['CONNECTING TO CONTAINERS', '', ''],
    ['docker terminal <name>', 'docker exec -it <name> bash', 'Opens terminal inside container'],
    ['docker connect <name>', 'docker exec -it <name> bash', 'Connects interactively to container'],
    ['docker shell <name>', 'docker exec -it <name> bash', 'Opens shell inside container'],
    ['docker enter <name>', 'docker exec -it <name> bash', 'Enters container with shell'],
    ['docker exec <name> <cmd>', 'docker exec -it <name> <cmd>', 'Runs command inside container'],
    ['', '', ''],
    ['RUNNING NEW CONTAINERS', '', ''],
    ['docker run <image>', 'docker run <image>', 'Creates and runs container from image'],
    ['docker run <image> detach', 'docker run -d <image>', 'Runs in background (detached)'],
    ['docker run <image> interactive', 'docker run -it <image>', 'Runs interactively with terminal'],
    ['docker run <image> port 8080:80', 'docker run -p 8080:80 <image>', 'Runs with port mapping'],
    ['docker run <image> name myapp', 'docker run --name myapp <image>', 'Runs with custom name'],
    ['', '', ''],
    ['CONTAINER LIFECYCLE', '', ''],
    ['docker start <name>', 'docker start <name>', 'Starts a stopped container'],
    ['docker stop <name>', 'docker stop <name>', 'Gracefully stops container'],
    ['docker kill <name>', 'docker kill <name>', 'Force stops immediately'],
    ['docker restart <name>', 'docker restart <name>', 'Restarts container'],
    ['docker pause <name>', 'docker pause <name>', 'Freezes container processes'],
    ['docker resume <name>', 'docker unpause <name>', 'Unfreezes paused container'],
    ['', '', ''],
    ['REMOVING', '', ''],
    ['docker remove <name>', 'docker rm <name>', 'Deletes stopped container'],
    ['docker remove image <name>', 'docker rmi <name>', 'Deletes an image'],
    ['docker remove volume <name>', 'docker volume rm <name>', 'Deletes a volume'],
    ['docker remove network <name>', 'docker network rm <name>', 'Deletes a network'],
    ['', '', ''],
    ['CLEANUP', '', ''],
    ['docker cleanup', 'docker system prune -f', 'Removes unused stuff'],
    ['docker cleanup all', 'docker system prune -a -f', 'Removes everything unused'],
    ['docker stop all', 'docker stop $(docker ps -q)', 'Stops all running containers'],
    ['docker remove all containers', 'docker rm $(docker ps -a -q)', 'Removes all stopped containers'],
    ['', '', ''],
    ['BUILDING', '', ''],
    ['docker build', 'docker build -t myapp .', 'Builds image from Dockerfile'],
    ['docker build tag <tag>', 'docker build -t <tag> .', 'Builds with specific tag'],
    ['', '', ''],
    ['IMAGES', '', ''],
    ['docker pull <image>', 'docker pull <image>', 'Downloads image from registry'],
    ['docker push <image>', 'docker push <image>', 'Uploads image to registry'],
    ['docker history <image>', 'docker history <image>', 'Shows image layers/history'],
    ['docker tag <old> <new>', 'docker tag <old> <new>', 'Creates new tag for image'],
    ['', '', ''],
    ['INSPECTING', '', ''],
    ['docker inspect <name>', 'docker inspect <name>', 'Shows detailed JSON info'],
    ['docker ip <name>', 'docker inspect -f ...', 'Shows container IP address'],
    ['docker ports <name>', 'docker port <name>', 'Shows port mappings'],
    ['docker top <name>', 'docker top <name>', 'Shows running processes'],
    ['docker stats <name>', 'docker stats <name>', 'Shows CPU/memory usage'],
    ['docker changes <name>', 'docker diff <name>', 'Shows filesystem changes'],
    ['', '', ''],
    ['COPYING FILES', '', ''],
    ['docker copy from <container>:/path .', 'docker cp <container>:/path .', 'Copies from container to host'],
    ['docker copy to ./file <container>:/path', 'docker cp ./file <container>:/path', 'Copies from host to container'],
    ['', '', ''],
    ['DOCKER COMPOSE', '', ''],
    ['docker compose up', 'docker-compose up', 'Starts all services'],
    ['docker compose up detach', 'docker-compose up -d', 'Starts services in background'],
    ['docker compose up build', 'docker-compose up --build', 'Rebuilds and starts'],
    ['docker compose down', 'docker-compose down', 'Stops and removes services'],
    ['docker compose down volumes', 'docker-compose down -v', 'Stops and removes volumes too'],
    ['docker compose logs', 'docker-compose logs', 'Shows all service logs'],
    ['docker compose logs follow', 'docker-compose logs -f', 'Follows all logs live'],
    ['docker compose ps', 'docker-compose ps', 'Shows service status'],
    ['docker compose restart', 'docker-compose restart', 'Restarts all services'],
  ];

  console.log('');
  printTable('DOCKER COMMANDS', headers, rows, colWidths);
  console.log('');

  console.log('  QUICK START:');
  console.log('  ─────────────────────────────────────────────────────────────────');
  console.log('  docker run nginx                    # Run nginx container');
  console.log('  docker run nginx detach             # Run in background');
  console.log('  docker terminal mycontainer         # Open terminal in container');
  console.log('  docker logs mycontainer follow      # Watch logs live');
  console.log('  docker stop mycontainer             # Stop container');
  console.log('');
  console.log('  WITH DOCKER COMPOSE:');
  console.log('  ─────────────────────────────────────────────────────────────────');
  console.log('  docker compose up detach            # Start all services');
  console.log('  docker compose logs follow          # Watch all logs');
  console.log('  docker compose down                 # Stop everything');
  console.log('');
}

module.exports = {
  executeDocker,
  printDockerHelp
};
