const { execSync } = require('child_process');
const { printCommand } = require('../utils/ascii');
const { printTable } = require('../utils/table');

// Linux system command mappings
const systemCommands = {
  // SYSTEM INFO
  'show system info': { cmd: 'hostnamectl', desc: 'Shows OS and system information' },
  'show hostname': { cmd: 'hostname', desc: 'Shows computer name' },
  'show uptime': { cmd: 'uptime -p', desc: 'Shows how long system has been running' },
  'show memory': { cmd: 'free -h', desc: 'Shows RAM usage' },
  'show disk': { cmd: 'df -h', desc: 'Shows disk space usage' },
  'show disk usage': { cmd: 'du -sh * 2>/dev/null | sort -hr | head -20', desc: 'Shows folder sizes' },
  'show cpu': { cmd: 'lscpu | head -20', desc: 'Shows CPU information' },
  'show cpu usage': { cmd: 'top -bn1 | head -20', desc: 'Shows CPU usage' },
  'show ip': { cmd: 'ip addr show | grep "inet "', desc: 'Shows IP addresses' },
  'show public ip': { cmd: 'curl -s ifconfig.me', desc: 'Shows public IP address' },
  'show users': { cmd: 'who', desc: 'Shows logged in users' },
  'show all users': { cmd: 'cat /etc/passwd | cut -d: -f1', desc: 'Lists all system users' },
  'show groups': { cmd: 'groups', desc: 'Shows your groups' },

  // PACKAGE MANAGEMENT (APT)
  'update packages': { cmd: 'sudo apt update', desc: 'Updates package list' },
  'upgrade packages': { cmd: 'sudo apt upgrade -y', desc: 'Upgrades all packages' },
  'update and upgrade': { cmd: 'sudo apt update && sudo apt upgrade -y', desc: 'Updates and upgrades all' },
  'show installed': { cmd: 'apt list --installed 2>/dev/null | head -50', desc: 'Lists installed packages' },
  'show upgradable': { cmd: 'apt list --upgradable 2>/dev/null', desc: 'Lists packages that can be upgraded' },
  'clean packages': { cmd: 'sudo apt autoremove -y && sudo apt autoclean', desc: 'Removes unused packages' },

  // SERVICES (SYSTEMCTL)
  'show services': { cmd: 'systemctl list-units --type=service --state=running', desc: 'Lists running services' },
  'show all services': { cmd: 'systemctl list-units --type=service', desc: 'Lists all services' },
  'show failed services': { cmd: 'systemctl --failed', desc: 'Lists failed services' },

  // FIREWALL (UFW)
  'firewall status': { cmd: 'sudo ufw status verbose', desc: 'Shows firewall status and rules' },
  'firewall enable': { cmd: 'sudo ufw enable', desc: 'Enables the firewall' },
  'firewall disable': { cmd: 'sudo ufw disable', desc: 'Disables the firewall' },
  'firewall reset': { cmd: 'sudo ufw reset', desc: 'Resets all firewall rules' },
  'firewall show rules': { cmd: 'sudo ufw status numbered', desc: 'Shows rules with numbers' },

  // PROCESSES
  'show processes': { cmd: 'ps aux | head -30', desc: 'Shows running processes' },
  'show top processes': { cmd: 'ps aux --sort=-%mem | head -15', desc: 'Shows top memory users' },
  'show top cpu': { cmd: 'ps aux --sort=-%cpu | head -15', desc: 'Shows top CPU users' },

  // LOGS
  'show system logs': { cmd: 'sudo journalctl -xe | tail -50', desc: 'Shows recent system logs' },
  'show boot logs': { cmd: 'sudo journalctl -b | tail -50', desc: 'Shows boot logs' },
  'show auth logs': { cmd: 'sudo tail -50 /var/log/auth.log', desc: 'Shows authentication logs' },
  'show syslog': { cmd: 'sudo tail -50 /var/log/syslog', desc: 'Shows system log' },

  // NETWORK
  'show network': { cmd: 'ip link show', desc: 'Shows network interfaces' },
  'show dns': { cmd: 'cat /etc/resolv.conf', desc: 'Shows DNS servers' },
  'show hosts': { cmd: 'cat /etc/hosts', desc: 'Shows hosts file' },
  'show routing': { cmd: 'ip route', desc: 'Shows routing table' },

  // SECURITY
  'show ssh attempts': { cmd: "sudo grep 'Failed password' /var/log/auth.log | tail -20", desc: 'Shows failed SSH logins' },
  'show last logins': { cmd: 'last -20', desc: 'Shows last 20 logins' },
  'show sudo users': { cmd: 'getent group sudo', desc: 'Shows users with sudo access' },
};

// Commands that need arguments
function getCommandWithArgs(command, args) {
  const argStr = args.join(' ');

  // PACKAGE MANAGEMENT
  if (command === 'install' && args.length >= 1) {
    const pkg = args.join(' ');
    return { cmd: `sudo apt install -y ${pkg}`, desc: `Installs ${pkg}` };
  }

  if (command === 'remove' && args.length >= 1) {
    const pkg = args.join(' ');
    return { cmd: `sudo apt remove -y ${pkg}`, desc: `Removes ${pkg}` };
  }

  if (command === 'purge' && args.length >= 1) {
    const pkg = args.join(' ');
    return { cmd: `sudo apt purge -y ${pkg}`, desc: `Completely removes ${pkg} and configs` };
  }

  if (command === 'search package' && args.length >= 1) {
    const pkg = args.join(' ');
    return { cmd: `apt search ${pkg}`, desc: `Searches for ${pkg}` };
  }

  if (command === 'show package' && args.length >= 1) {
    const pkg = args[0];
    return { cmd: `apt show ${pkg}`, desc: `Shows package info` };
  }

  // SERVICES
  if (command === 'service status' && args.length >= 1) {
    const service = args[0];
    return { cmd: `sudo systemctl status ${service}`, desc: `Shows ${service} status` };
  }

  if (command === 'service start' && args.length >= 1) {
    const service = args[0];
    return { cmd: `sudo systemctl start ${service}`, desc: `Starts ${service}` };
  }

  if (command === 'service stop' && args.length >= 1) {
    const service = args[0];
    return { cmd: `sudo systemctl stop ${service}`, desc: `Stops ${service}` };
  }

  if (command === 'service restart' && args.length >= 1) {
    const service = args[0];
    return { cmd: `sudo systemctl restart ${service}`, desc: `Restarts ${service}` };
  }

  if (command === 'service enable' && args.length >= 1) {
    const service = args[0];
    return { cmd: `sudo systemctl enable ${service}`, desc: `Enables ${service} on boot` };
  }

  if (command === 'service disable' && args.length >= 1) {
    const service = args[0];
    return { cmd: `sudo systemctl disable ${service}`, desc: `Disables ${service} on boot` };
  }

  if (command === 'service logs' && args.length >= 1) {
    const service = args[0];
    return { cmd: `sudo journalctl -u ${service} -f`, desc: `Shows ${service} logs (live)` };
  }

  // FIREWALL
  if (command === 'firewall allow' && args.length >= 1) {
    const port = args[0];
    return { cmd: `sudo ufw allow ${port}`, desc: `Allows port ${port}` };
  }

  if (command === 'firewall deny' && args.length >= 1) {
    const port = args[0];
    return { cmd: `sudo ufw deny ${port}`, desc: `Denies port ${port}` };
  }

  if (command === 'firewall delete rule' && args.length >= 1) {
    const num = args[0];
    return { cmd: `sudo ufw delete ${num}`, desc: `Deletes rule number ${num}` };
  }

  if (command === 'firewall allow from' && args.length >= 1) {
    const ip = args[0];
    return { cmd: `sudo ufw allow from ${ip}`, desc: `Allows all from ${ip}` };
  }

  if (command === 'firewall allow ssh from' && args.length >= 1) {
    const ip = args[0];
    return { cmd: `sudo ufw allow from ${ip} to any port 22`, desc: `Allows SSH from ${ip}` };
  }

  // USER MANAGEMENT
  if (command === 'create user' && args.length >= 1) {
    const user = args[0];
    return { cmd: `sudo adduser ${user}`, desc: `Creates new user ${user}` };
  }

  if (command === 'delete user' && args.length >= 1) {
    const user = args[0];
    return { cmd: `sudo deluser ${user}`, desc: `Deletes user ${user}` };
  }

  if (command === 'add to sudo' && args.length >= 1) {
    const user = args[0];
    return { cmd: `sudo usermod -aG sudo ${user}`, desc: `Gives ${user} sudo access` };
  }

  if (command === 'add to group' && args.length >= 2) {
    const user = args[0];
    const group = args[1];
    return { cmd: `sudo usermod -aG ${group} ${user}`, desc: `Adds ${user} to ${group}` };
  }

  if (command === 'switch user' && args.length >= 1) {
    const user = args[0];
    return { cmd: `su - ${user}`, desc: `Switches to user ${user}` };
  }

  // PROCESS MANAGEMENT
  if (command === 'kill process' && args.length >= 1) {
    const pid = args[0];
    return { cmd: `sudo kill ${pid}`, desc: `Kills process ${pid}` };
  }

  if (command === 'kill by name' && args.length >= 1) {
    const name = args[0];
    return { cmd: `sudo pkill ${name}`, desc: `Kills processes named ${name}` };
  }

  if (command === 'find process' && args.length >= 1) {
    const name = args[0];
    return { cmd: `ps aux | grep ${name}`, desc: `Finds processes matching ${name}` };
  }

  // DISK
  if (command === 'show disk usage for' && args.length >= 1) {
    const dir = args[0];
    return { cmd: `du -sh ${dir}/*`, desc: `Shows sizes in ${dir}` };
  }

  // NETWORK
  if (command === 'test connection' && args.length >= 1) {
    const host = args[0];
    return { cmd: `ping -c 4 ${host}`, desc: `Pings ${host}` };
  }

  if (command === 'trace route' && args.length >= 1) {
    const host = args[0];
    return { cmd: `traceroute ${host}`, desc: `Traces route to ${host}` };
  }

  if (command === 'check port' && args.length >= 2) {
    const host = args[0];
    const port = args[1];
    return { cmd: `nc -zv ${host} ${port}`, desc: `Checks if port is open` };
  }

  // PERMISSIONS
  if (command === 'make owner' && args.length >= 2) {
    const user = args[0];
    const file = args.slice(1).join(' ');
    return { cmd: `sudo chown ${user}:${user} ${file}`, desc: `Makes ${user} owner of ${file}` };
  }

  if (command === 'make readable' && args.length >= 1) {
    const file = args.join(' ');
    return { cmd: `chmod +r ${file}`, desc: 'Adds read permission' };
  }

  if (command === 'make writable' && args.length >= 1) {
    const file = args.join(' ');
    return { cmd: `chmod +w ${file}`, desc: 'Adds write permission' };
  }

  if (command === 'make executable' && args.length >= 1) {
    const file = args.join(' ');
    return { cmd: `chmod +x ${file}`, desc: 'Adds execute permission' };
  }

  return null;
}

function executeSystem(args) {
  const fullCommand = args.join(' ').trim();

  // Check for help
  if (fullCommand === 'help' || fullCommand === '') {
    return printSystemHelp();
  }

  // Check exact matches first
  if (systemCommands[fullCommand]) {
    const { cmd } = systemCommands[fullCommand];
    return runCommand(cmd);
  }

  // Check commands with arguments
  const patterns = [
    'install', 'remove', 'purge', 'search package', 'show package',
    'service status', 'service start', 'service stop', 'service restart',
    'service enable', 'service disable', 'service logs',
    'firewall allow ssh from', 'firewall allow from', 'firewall allow',
    'firewall deny', 'firewall delete rule',
    'create user', 'delete user', 'add to sudo', 'add to group', 'switch user',
    'kill process', 'kill by name', 'find process',
    'show disk usage for',
    'test connection', 'trace route', 'check port',
    'make owner', 'make readable', 'make writable', 'make executable'
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
  console.log(`Unknown system command: ${fullCommand}`);
  console.log('Type "friendly system help" for available commands.');
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

function printSystemHelp() {
  const headers = ['Friendly Command', 'Actual Command', 'What It Does'];
  const colWidths = [38, 45, 37];

  const rows = [
    ['SYSTEM INFO', '', ''],
    ['system show system info', 'hostnamectl', 'Shows OS and system info'],
    ['system show uptime', 'uptime -p', 'Shows how long running'],
    ['system show memory', 'free -h', 'Shows RAM usage'],
    ['system show disk', 'df -h', 'Shows disk space'],
    ['system show disk usage', 'du -sh * | sort -hr', 'Shows folder sizes'],
    ['system show cpu', 'lscpu', 'Shows CPU info'],
    ['system show ip', 'ip addr show', 'Shows IP addresses'],
    ['system show public ip', 'curl ifconfig.me', 'Shows public IP'],
    ['', '', ''],
    ['PACKAGES (APT)', '', ''],
    ['system update packages', 'apt update', 'Updates package list'],
    ['system upgrade packages', 'apt upgrade -y', 'Upgrades all packages'],
    ['system install nginx', 'apt install -y nginx', 'Installs a package'],
    ['system remove nginx', 'apt remove -y nginx', 'Removes a package'],
    ['system search package node', 'apt search node', 'Searches for packages'],
    ['system show installed', 'apt list --installed', 'Lists installed'],
    ['system clean packages', 'apt autoremove...', 'Removes unused'],
    ['', '', ''],
    ['SERVICES (systemctl)', '', ''],
    ['system show services', 'systemctl list-units...', 'Lists running services'],
    ['system service status nginx', 'systemctl status nginx', 'Shows service status'],
    ['system service start nginx', 'systemctl start nginx', 'Starts a service'],
    ['system service stop nginx', 'systemctl stop nginx', 'Stops a service'],
    ['system service restart nginx', 'systemctl restart nginx', 'Restarts a service'],
    ['system service enable nginx', 'systemctl enable nginx', 'Enables on boot'],
    ['system service logs nginx', 'journalctl -u nginx -f', 'Shows logs (live)'],
    ['', '', ''],
    ['FIREWALL (UFW)', '', ''],
    ['system firewall status', 'ufw status verbose', 'Shows firewall status'],
    ['system firewall enable', 'ufw enable', 'Enables firewall'],
    ['system firewall allow 80', 'ufw allow 80', 'Allows port 80'],
    ['system firewall allow 443', 'ufw allow 443', 'Allows HTTPS'],
    ['system firewall deny 23', 'ufw deny 23', 'Denies port 23'],
    ['system firewall allow from 1.2.3.4', 'ufw allow from 1.2.3.4', 'Allows IP'],
    ['system firewall show rules', 'ufw status numbered', 'Shows numbered rules'],
    ['system firewall delete rule 3', 'ufw delete 3', 'Deletes rule #3'],
    ['', '', ''],
    ['USER MANAGEMENT', '', ''],
    ['system show users', 'who', 'Shows logged in users'],
    ['system create user john', 'adduser john', 'Creates new user'],
    ['system delete user john', 'deluser john', 'Deletes user'],
    ['system add to sudo john', 'usermod -aG sudo john', 'Gives sudo access'],
    ['system add to group john docker', 'usermod -aG docker john', 'Adds to group'],
    ['system show sudo users', 'getent group sudo', 'Lists sudo users'],
    ['', '', ''],
    ['PROCESSES', '', ''],
    ['system show processes', 'ps aux', 'Shows all processes'],
    ['system show top processes', 'ps aux --sort=-%mem', 'Top memory users'],
    ['system find process nginx', 'ps aux | grep nginx', 'Finds processes'],
    ['system kill process 1234', 'kill 1234', 'Kills by PID'],
    ['system kill by name nginx', 'pkill nginx', 'Kills by name'],
    ['', '', ''],
    ['LOGS', '', ''],
    ['system show system logs', 'journalctl -xe', 'Recent system logs'],
    ['system show auth logs', 'tail /var/log/auth.log', 'Auth/login logs'],
    ['system show ssh attempts', 'grep Failed auth.log', 'Failed SSH logins'],
    ['system show last logins', 'last -20', 'Recent logins'],
    ['', '', ''],
    ['NETWORK', '', ''],
    ['system test connection google.com', 'ping -c 4 google.com', 'Pings host'],
    ['system trace route google.com', 'traceroute google.com', 'Traces route'],
    ['system check port host.com 443', 'nc -zv host.com 443', 'Checks if port open'],
    ['system show dns', 'cat /etc/resolv.conf', 'Shows DNS servers'],
    ['', '', ''],
    ['PERMISSIONS', '', ''],
    ['system make owner john /var/www', 'chown john:john /var/www', 'Changes owner'],
    ['system make executable script.sh', 'chmod +x script.sh', 'Makes executable'],
  ];

  console.log('');
  printTable('LINUX SYSTEM COMMANDS (Ubuntu/Debian)', headers, rows, colWidths);
  console.log('');

  // Extra tips
  console.log('  COMMON INITIAL SERVER SETUP:');
  console.log('  ─────────────────────────────────────────────────────────────────');
  console.log('  1. system update and upgrade           # Update system');
  console.log('  2. system firewall enable              # Enable firewall');
  console.log('  3. system firewall allow 22            # Allow SSH');
  console.log('  4. system firewall allow 80            # Allow HTTP');
  console.log('  5. system firewall allow 443           # Allow HTTPS');
  console.log('  6. system create user deploy           # Create deploy user');
  console.log('  7. system add to sudo deploy           # Give sudo access');
  console.log('');
}

module.exports = {
  executeSystem,
  printSystemHelp
};
