const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const { printLogo, printSetupComplete, printSuccess, printError, printWarning, printInfo } = require('./utils/ascii');

// Shell script that wraps the commands
const shellScript = `
# Friendly Terminal - Human-readable commands
# https://github.com/friendly-terminal

# Check if in friendly mode
_friendly_mode() {
  local mode_file="$HOME/.friendly-terminal/mode"
  if [ -f "$mode_file" ]; then
    cat "$mode_file"
  else
    echo "friendly"
  fi
}

# Git wrapper
git() {
  local mode=$(_friendly_mode)

  # Always allow help commands
  if [ "$1" = "help" ]; then
    if [ -z "$2" ]; then
      friendly git help
    else
      friendly git help "$2"
    fi
    return
  fi

  # In traditional mode, pass through everything
  if [ "$mode" = "traditional" ]; then
    command git "$@"
    return
  fi

  # In friendly mode, translate commands
  case "$1" in
    show|save|commit|sync|rewind|discard|add|remove|draft|switch|create|delete|merge|rehome|download|fetch|revert|cherry-pick|clean|config)
      friendly git "$@"
      ;;
    *)
      command git "$@"
      ;;
  esac
}

# NPM wrapper
npm() {
  local mode=$(_friendly_mode)

  if [ "$1" = "help" ]; then
    friendly npm help
    return
  fi

  if [ "$mode" = "traditional" ]; then
    command npm "$@"
    return
  fi

  case "$1" in
    install|uninstall|show|update|run)
      friendly npm "$@"
      ;;
    *)
      command npm "$@"
      ;;
  esac
}

# Java wrapper
java() {
  local mode=$(_friendly_mode)

  if [ "$1" = "help" ]; then
    friendly java help
    return
  fi

  if [ "$mode" = "traditional" ]; then
    command java "$@"
    return
  fi

  case "$1" in
    compile|run|create|extract|show|find)
      friendly java "$@"
      ;;
    *)
      command java "$@"
      ;;
  esac
}

# Docker wrapper
docker() {
  local mode=$(_friendly_mode)

  if [ "$1" = "help" ]; then
    friendly docker help
    return
  fi

  if [ "$mode" = "traditional" ]; then
    command docker "$@"
    return
  fi

  case "$1" in
    show|logs|follow|terminal|connect|shell|enter|run|start|stop|kill|restart|pause|resume|remove|delete|build|pull|push|inspect|ip|ports|top|stats|changes|copy|cleanup|compose|history|rename|diff)
      friendly docker "$@"
      ;;
    *)
      command docker "$@"
      ;;
  esac
}

# Gradle wrapper
gradle() {
  local mode=$(_friendly_mode)

  if [ "$1" = "help" ]; then
    friendly gradle help
    return
  fi

  if [ "$mode" = "traditional" ]; then
    command ./gradlew "$@"
    return
  fi

  friendly gradle "$@"
}

# Maven wrapper
maven() {
  local mode=$(_friendly_mode)

  if [ "$1" = "help" ]; then
    friendly maven help
    return
  fi

  if [ "$mode" = "traditional" ]; then
    command mvn "$@"
    return
  fi

  friendly maven "$@"
}

# Files command (always uses friendly)
files() {
  friendly files "$@"
}

# Shell scripting commands (Linux/macOS)
shell() {
  friendly shell "$@"
}

# Server commands - nginx, apache, ssl (Linux)
server() {
  friendly server "$@"
}

# System administration commands (Linux)
system() {
  friendly system "$@"
}
`;

// PowerShell script
const powershellScript = `
# Friendly Terminal - Human-readable commands
# https://github.com/friendly-terminal

function Get-FriendlyMode {
  $modeFile = "$env:USERPROFILE\\.friendly-terminal\\mode"
  if (Test-Path $modeFile) {
    return (Get-Content $modeFile).Trim()
  }
  return "friendly"
}

function git {
  param([Parameter(ValueFromRemainingArguments=$true)]$args)
  $firstArg = $args[0]
  $mode = Get-FriendlyMode

  # Always allow help
  if ($firstArg -eq 'help') {
    & friendly git @args
    return
  }

  # Traditional mode - pass through
  if ($mode -eq 'traditional') {
    & git.exe @args
    return
  }

  # Friendly mode
  switch ($firstArg) {
    {$_ -in 'show','save','commit','sync','rewind','discard','add','remove','draft','switch','create','delete','merge','rehome','download','fetch','revert','cherry-pick','clean','config'} {
      & friendly git @args
    }
    default {
      & git.exe @args
    }
  }
}

function npm {
  param([Parameter(ValueFromRemainingArguments=$true)]$args)
  $firstArg = $args[0]
  $mode = Get-FriendlyMode

  if ($firstArg -eq 'help') {
    & friendly npm help
    return
  }

  if ($mode -eq 'traditional') {
    & npm.cmd @args
    return
  }

  switch ($firstArg) {
    {$_ -in 'install','uninstall','show','update','run'} {
      & friendly npm @args
    }
    default {
      & npm.cmd @args
    }
  }
}

function java {
  param([Parameter(ValueFromRemainingArguments=$true)]$args)
  $firstArg = $args[0]
  $mode = Get-FriendlyMode

  if ($firstArg -eq 'help') {
    & friendly java help
    return
  }

  if ($mode -eq 'traditional') {
    & java.exe @args
    return
  }

  switch ($firstArg) {
    {$_ -in 'compile','run','create','extract','show','find'} {
      & friendly java @args
    }
    default {
      & java.exe @args
    }
  }
}

function docker {
  param([Parameter(ValueFromRemainingArguments=$true)]$args)
  $mode = Get-FriendlyMode

  if ($args[0] -eq 'help') {
    & friendly docker help
    return
  }

  if ($mode -eq 'traditional') {
    & docker.exe @args
    return
  }

  switch ($args[0]) {
    {$_ -in 'show','logs','follow','terminal','connect','shell','enter','run','start','stop','kill','restart','pause','resume','remove','delete','build','pull','push','inspect','ip','ports','top','stats','changes','copy','cleanup','compose','history','rename','diff'} {
      & friendly docker @args
    }
    default {
      & docker.exe @args
    }
  }
}

function gradle {
  param([Parameter(ValueFromRemainingArguments=$true)]$args)
  $mode = Get-FriendlyMode

  if ($args[0] -eq 'help') {
    & friendly gradle help
    return
  }

  if ($mode -eq 'traditional') {
    & .\\gradlew @args
    return
  }

  & friendly gradle @args
}

function maven {
  param([Parameter(ValueFromRemainingArguments=$true)]$args)
  $mode = Get-FriendlyMode

  if ($args[0] -eq 'help') {
    & friendly maven help
    return
  }

  if ($mode -eq 'traditional') {
    & mvn @args
    return
  }

  & friendly maven @args
}

function files {
  param([Parameter(ValueFromRemainingArguments=$true)]$args)
  & friendly files @args
}
`;

function detectShell() {
  const shell = process.env.SHELL || '';

  if (shell.includes('zsh')) {
    return { name: 'zsh', config: path.join(os.homedir(), '.zshrc') };
  } else if (shell.includes('bash')) {
    // Check for .bashrc or .bash_profile
    const bashrc = path.join(os.homedir(), '.bashrc');
    const bashProfile = path.join(os.homedir(), '.bash_profile');

    if (fs.existsSync(bashrc)) {
      return { name: 'bash', config: bashrc };
    }
    return { name: 'bash', config: bashProfile };
  } else if (process.platform === 'win32') {
    // PowerShell
    const psProfile = execSync('powershell -Command "echo $PROFILE"', { encoding: 'utf-8' }).trim();
    return { name: 'powershell', config: psProfile };
  }

  return { name: 'unknown', config: null };
}

function runSetup() {
  printLogo();

  console.log('');
  printInfo('Setting up Friendly Terminal...');
  console.log('');

  const shell = detectShell();

  console.log(`  Detected shell: ${shell.name}`);
  console.log(`  Config file:    ${shell.config}`);
  console.log('');

  if (!shell.config) {
    printError('Could not detect your shell configuration file.');
    console.log('  Please manually add the friendly commands to your shell config.');
    return;
  }

  // Create the friendly scripts directory
  const scriptsDir = path.join(os.homedir(), '.friendly-terminal');
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
  }

  // Write the appropriate script
  let scriptPath;
  let sourceCommand;

  if (shell.name === 'powershell') {
    scriptPath = path.join(scriptsDir, 'friendly.ps1');
    fs.writeFileSync(scriptPath, powershellScript);
    sourceCommand = `. "${scriptPath}"`;
  } else {
    scriptPath = path.join(scriptsDir, 'friendly.sh');
    fs.writeFileSync(scriptPath, shellScript);
    sourceCommand = `source "${scriptPath}"`;
  }

  printSuccess(`Created ${scriptPath}`);

  // Check if already added to config
  let configContent = '';
  if (fs.existsSync(shell.config)) {
    configContent = fs.readFileSync(shell.config, 'utf-8');
  }

  if (configContent.includes('friendly-terminal') || configContent.includes('friendly.sh') || configContent.includes('friendly.ps1')) {
    printWarning('Friendly Terminal is already in your shell config.');
  } else {
    // Add to config
    const addition = `\n# Friendly Terminal\n${sourceCommand}\n`;
    fs.appendFileSync(shell.config, addition);
    printSuccess(`Added to ${shell.config}`);
  }

  printSetupComplete();
}

module.exports = { runSetup, detectShell };
