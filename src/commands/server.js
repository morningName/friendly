const { execSync } = require('child_process');
const { printCommand } = require('../utils/ascii');
const { printTable } = require('../utils/table');

// Server/Web command mappings
const serverCommands = {
  // NGINX
  'nginx status': { cmd: 'sudo systemctl status nginx', desc: 'Shows nginx service status' },
  'nginx start': { cmd: 'sudo systemctl start nginx', desc: 'Starts nginx server' },
  'nginx stop': { cmd: 'sudo systemctl stop nginx', desc: 'Stops nginx server' },
  'nginx restart': { cmd: 'sudo systemctl restart nginx', desc: 'Restarts nginx server' },
  'nginx reload': { cmd: 'sudo systemctl reload nginx', desc: 'Reloads nginx config without downtime' },
  'nginx test config': { cmd: 'sudo nginx -t', desc: 'Tests nginx configuration for errors' },
  'nginx show config': { cmd: 'cat /etc/nginx/nginx.conf', desc: 'Shows main nginx config' },
  'nginx show sites': { cmd: 'ls -la /etc/nginx/sites-enabled/', desc: 'Lists enabled sites' },
  'nginx show available': { cmd: 'ls -la /etc/nginx/sites-available/', desc: 'Lists available sites' },
  'nginx show logs': { cmd: 'sudo tail -f /var/log/nginx/access.log', desc: 'Shows access logs (live)' },
  'nginx show errors': { cmd: 'sudo tail -f /var/log/nginx/error.log', desc: 'Shows error logs (live)' },

  // APACHE
  'apache status': { cmd: 'sudo systemctl status apache2', desc: 'Shows Apache service status' },
  'apache start': { cmd: 'sudo systemctl start apache2', desc: 'Starts Apache server' },
  'apache stop': { cmd: 'sudo systemctl stop apache2', desc: 'Stops Apache server' },
  'apache restart': { cmd: 'sudo systemctl restart apache2', desc: 'Restarts Apache server' },
  'apache reload': { cmd: 'sudo systemctl reload apache2', desc: 'Reloads Apache config' },
  'apache test config': { cmd: 'sudo apachectl configtest', desc: 'Tests Apache configuration' },
  'apache show sites': { cmd: 'ls -la /etc/apache2/sites-enabled/', desc: 'Lists enabled sites' },
  'apache show modules': { cmd: 'apache2ctl -M', desc: 'Lists loaded modules' },
  'apache show logs': { cmd: 'sudo tail -f /var/log/apache2/access.log', desc: 'Shows access logs' },
  'apache show errors': { cmd: 'sudo tail -f /var/log/apache2/error.log', desc: 'Shows error logs' },

  // SSL/CERTBOT
  'ssl show certificates': { cmd: 'sudo certbot certificates', desc: 'Lists all SSL certificates' },
  'ssl renew all': { cmd: 'sudo certbot renew', desc: 'Renews all certificates' },
  'ssl renew dry run': { cmd: 'sudo certbot renew --dry-run', desc: 'Tests renewal without changes' },
  'ssl show expiry': { cmd: "sudo certbot certificates 2>/dev/null | grep -E '(Certificate Name|Expiry)'", desc: 'Shows certificate expiry dates' },

  // PORTS & CONNECTIONS
  'show open ports': { cmd: 'sudo netstat -tlnp', desc: 'Shows all listening ports' },
  'show connections': { cmd: 'sudo netstat -anp | head -50', desc: 'Shows active connections' },
  'show port usage': { cmd: 'sudo lsof -i -P -n | head -30', desc: 'Shows what is using ports' },
};

// Commands that need arguments
function getCommandWithArgs(command, args) {
  const argStr = args.join(' ');

  // NGINX SITE MANAGEMENT
  if (command === 'nginx enable site' && args.length >= 1) {
    const site = args[0];
    return { cmd: `sudo ln -s /etc/nginx/sites-available/${site} /etc/nginx/sites-enabled/${site}`, desc: 'Enables a site' };
  }

  if (command === 'nginx disable site' && args.length >= 1) {
    const site = args[0];
    return { cmd: `sudo rm /etc/nginx/sites-enabled/${site}`, desc: 'Disables a site' };
  }

  if (command === 'nginx edit site' && args.length >= 1) {
    const site = args[0];
    return { cmd: `sudo \${EDITOR:-nano} /etc/nginx/sites-available/${site}`, desc: 'Edit site config' };
  }

  if (command === 'nginx create site' && args.length >= 1) {
    const site = args[0];
    return { cmd: `sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/${site} && sudo \${EDITOR:-nano} /etc/nginx/sites-available/${site}`, desc: 'Creates new site from template' };
  }

  // APACHE SITE MANAGEMENT
  if (command === 'apache enable site' && args.length >= 1) {
    const site = args[0];
    return { cmd: `sudo a2ensite ${site}`, desc: 'Enables a site' };
  }

  if (command === 'apache disable site' && args.length >= 1) {
    const site = args[0];
    return { cmd: `sudo a2dissite ${site}`, desc: 'Disables a site' };
  }

  if (command === 'apache enable module' && args.length >= 1) {
    const mod = args[0];
    return { cmd: `sudo a2enmod ${mod}`, desc: 'Enables Apache module' };
  }

  if (command === 'apache disable module' && args.length >= 1) {
    const mod = args[0];
    return { cmd: `sudo a2dismod ${mod}`, desc: 'Disables Apache module' };
  }

  // SSL CERTIFICATE
  if (command === 'ssl get certificate' && args.length >= 1) {
    const domain = args[0];
    return { cmd: `sudo certbot --nginx -d ${domain}`, desc: 'Gets SSL cert for domain (nginx)' };
  }

  if (command === 'ssl get certificate apache' && args.length >= 1) {
    const domain = args[0];
    return { cmd: `sudo certbot --apache -d ${domain}`, desc: 'Gets SSL cert for domain (apache)' };
  }

  if (command === 'ssl get certificate standalone' && args.length >= 1) {
    const domain = args[0];
    return { cmd: `sudo certbot certonly --standalone -d ${domain}`, desc: 'Gets SSL cert (standalone)' };
  }

  if (command === 'ssl delete certificate' && args.length >= 1) {
    const domain = args[0];
    return { cmd: `sudo certbot delete --cert-name ${domain}`, desc: 'Deletes a certificate' };
  }

  // PORT CHECKING
  if (command === 'show port' && args.length >= 1) {
    const port = args[0];
    return { cmd: `sudo lsof -i :${port}`, desc: `Shows what's using port ${port}` };
  }

  if (command === 'kill port' && args.length >= 1) {
    const port = args[0];
    return { cmd: `sudo fuser -k ${port}/tcp`, desc: `Kills process on port ${port}` };
  }

  // REVERSE PROXY TEMPLATES
  if (command === 'nginx proxy' && args.length >= 2) {
    const domain = args[0];
    const port = args[1];
    const config = `server {
    listen 80;
    server_name ${domain};

    location / {
        proxy_pass http://localhost:${port};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}`;
    return { cmd: `echo '${config}' | sudo tee /etc/nginx/sites-available/${domain}`, desc: 'Creates reverse proxy config' };
  }

  return null;
}

function executeServer(args) {
  const fullCommand = args.join(' ').trim();

  // Check for help
  if (fullCommand === 'help' || fullCommand === '') {
    return printServerHelp();
  }

  // Check exact matches first
  if (serverCommands[fullCommand]) {
    const { cmd } = serverCommands[fullCommand];
    return runCommand(cmd);
  }

  // Check commands with arguments
  const patterns = [
    'nginx enable site', 'nginx disable site', 'nginx edit site', 'nginx create site', 'nginx proxy',
    'apache enable site', 'apache disable site', 'apache enable module', 'apache disable module',
    'ssl get certificate apache', 'ssl get certificate standalone', 'ssl get certificate', 'ssl delete certificate',
    'show port', 'kill port'
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
  console.log(`Unknown server command: ${fullCommand}`);
  console.log('Type "friendly server help" for available commands.');
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

function printServerHelp() {
  const headers = ['Friendly Command', 'Actual Command', 'What It Does'];
  const colWidths = [40, 45, 35];

  const rows = [
    ['NGINX - Basic', '', ''],
    ['server nginx status', 'systemctl status nginx', 'Shows nginx status'],
    ['server nginx start', 'systemctl start nginx', 'Starts nginx'],
    ['server nginx stop', 'systemctl stop nginx', 'Stops nginx'],
    ['server nginx restart', 'systemctl restart nginx', 'Restarts nginx'],
    ['server nginx reload', 'systemctl reload nginx', 'Reloads config (no downtime)'],
    ['server nginx test config', 'nginx -t', 'Tests configuration'],
    ['', '', ''],
    ['NGINX - Sites', '', ''],
    ['server nginx show sites', 'ls sites-enabled/', 'Lists enabled sites'],
    ['server nginx enable site mysite', 'ln -s ...', 'Enables a site'],
    ['server nginx disable site mysite', 'rm sites-enabled/...', 'Disables a site'],
    ['server nginx edit site mysite', 'nano sites-available/...', 'Edit site config'],
    ['server nginx create site mysite', 'cp default ...', 'Creates from template'],
    ['', '', ''],
    ['NGINX - Reverse Proxy', '', ''],
    ['server nginx proxy domain.com 3000', 'Creates config file', 'Sets up reverse proxy'],
    ['', '', ''],
    ['NGINX - Logs', '', ''],
    ['server nginx show logs', 'tail -f access.log', 'Shows access logs (live)'],
    ['server nginx show errors', 'tail -f error.log', 'Shows error logs (live)'],
    ['', '', ''],
    ['APACHE - Basic', '', ''],
    ['server apache status', 'systemctl status apache2', 'Shows Apache status'],
    ['server apache start', 'systemctl start apache2', 'Starts Apache'],
    ['server apache stop', 'systemctl stop apache2', 'Stops Apache'],
    ['server apache restart', 'systemctl restart apache2', 'Restarts Apache'],
    ['server apache test config', 'apachectl configtest', 'Tests configuration'],
    ['', '', ''],
    ['APACHE - Sites & Modules', '', ''],
    ['server apache enable site mysite', 'a2ensite mysite', 'Enables a site'],
    ['server apache disable site mysite', 'a2dissite mysite', 'Disables a site'],
    ['server apache enable module ssl', 'a2enmod ssl', 'Enables a module'],
    ['server apache show modules', 'apache2ctl -M', 'Lists loaded modules'],
    ['', '', ''],
    ['SSL/HTTPS (Certbot)', '', ''],
    ['server ssl show certificates', 'certbot certificates', 'Lists all certificates'],
    ['server ssl get certificate domain.com', 'certbot --nginx -d ...', 'Gets SSL cert (nginx)'],
    ['server ssl get certificate apache domain.com', 'certbot --apache -d ...', 'Gets SSL cert (apache)'],
    ['server ssl renew all', 'certbot renew', 'Renews all certificates'],
    ['server ssl renew dry run', 'certbot renew --dry-run', 'Tests renewal'],
    ['server ssl show expiry', 'certbot certificates...', 'Shows expiry dates'],
    ['', '', ''],
    ['PORTS & CONNECTIONS', '', ''],
    ['server show open ports', 'netstat -tlnp', 'Shows listening ports'],
    ['server show port 3000', 'lsof -i :3000', 'Shows what uses port'],
    ['server kill port 3000', 'fuser -k 3000/tcp', 'Kills process on port'],
    ['server show connections', 'netstat -anp', 'Shows active connections'],
  ];

  console.log('');
  printTable('WEB SERVER COMMANDS (NGINX / APACHE / SSL)', headers, rows, colWidths);
  console.log('');

  // Extra tips
  console.log('  REVERSE PROXY QUICK SETUP:');
  console.log('  ─────────────────────────────────────────────────────────────────');
  console.log('  1. server nginx proxy myapp.com 3000    # Creates config');
  console.log('  2. server nginx enable site myapp.com   # Enables the site');
  console.log('  3. server nginx test config             # Tests for errors');
  console.log('  4. server nginx reload                  # Apply changes');
  console.log('  5. server ssl get certificate myapp.com # Add HTTPS');
  console.log('');
  console.log('  COMMON CONFIG LOCATIONS:');
  console.log('  ─────────────────────────────────────────────────────────────────');
  console.log('  Nginx main config:     /etc/nginx/nginx.conf');
  console.log('  Nginx sites:           /etc/nginx/sites-available/');
  console.log('  Apache main config:    /etc/apache2/apache2.conf');
  console.log('  Apache sites:          /etc/apache2/sites-available/');
  console.log('  SSL certificates:      /etc/letsencrypt/live/');
  console.log('');
}

module.exports = {
  executeServer,
  printServerHelp
};
