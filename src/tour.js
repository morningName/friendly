const chalk = require('chalk');
const { printLogo } = require('./utils/ascii');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTour() {
  console.clear();
  printLogo();

  console.log(chalk.green('  ╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.green('  ║                                                            ║'));
  console.log(chalk.green('  ║   Welcome! Let me show you around.                         ║'));
  console.log(chalk.green('  ║                                                            ║'));
  console.log(chalk.green('  ║   This will take about 2 minutes.                          ║'));
  console.log(chalk.green('  ║   (Or run "friendly tour quick" for the short version)     ║'));
  console.log(chalk.green('  ║                                                            ║'));
  console.log(chalk.green('  ╚════════════════════════════════════════════════════════════╝'));
  console.log('');

  await sleep(3000);

  // Step 1: The Problem
  console.log(chalk.bold.yellow('\n  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.bold.yellow('  STEP 1: THE PROBLEM'));
  console.log(chalk.bold.yellow('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  console.log('  Terminal commands are hard to remember. Look at these:\n');
  console.log(chalk.gray('    git reset --soft HEAD~1'));
  console.log(chalk.red('    ^ What does this do? Who knows!\n'));
  console.log(chalk.gray('    docker ps -a'));
  console.log(chalk.red('    ^ What is "ps"? What is "-a"?\n'));
  console.log(chalk.gray('    npm install --save-dev'));
  console.log(chalk.red('    ^ So many flags to remember...\n'));
  console.log('  You end up googling the same commands over and over.');
  console.log('');

  await sleep(4000);

  // Step 2: The Solution
  console.log(chalk.bold.yellow('\n  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.bold.yellow('  STEP 2: THE SOLUTION'));
  console.log(chalk.bold.yellow('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  console.log('  What if you could just type what you want to do?\n');
  console.log(chalk.cyan('    git rewind 1 commit'));
  console.log(chalk.green('    ^ Undo my last commit. Makes sense!\n'));
  console.log(chalk.cyan('    docker show all containers'));
  console.log(chalk.green('    ^ Show all containers. Easy to understand!\n'));
  console.log(chalk.cyan('    npm add lodash --dev'));
  console.log(chalk.green('    ^ Add lodash as a dev dependency. Clear!\n'));
  console.log('  That\'s what Friendly Terminal does.');
  console.log('  You type readable commands, we translate them for you.');
  console.log('');

  await sleep(4000);

  // Step 3: You Still Learn
  console.log(chalk.bold.yellow('\n  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.bold.yellow('  STEP 3: YOU STILL LEARN THE REAL COMMANDS'));
  console.log(chalk.bold.yellow('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  console.log('  Here\'s the cool part. Every time you run a command,');
  console.log('  we show you what\'s actually happening:\n');
  console.log(chalk.white('    $ git save "fixed the bug"'));
  console.log(chalk.gray('      Running: git add . && git commit -m "fixed the bug"'));
  console.log(chalk.green('      ✓ Saved 3 files\n'));
  console.log('  See that "Running:" line? That\'s the real command.');
  console.log('  Over time, you\'ll start recognizing them.');
  console.log('  ');
  console.log('  ' + chalk.bold('Friendly Terminal is a learning tool, not a crutch.'));
  console.log('');

  await sleep(5000);

  // Step 4: Try It Now
  console.log(chalk.bold.yellow('\n  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.bold.yellow('  STEP 4: TRY SOME COMMANDS'));
  console.log(chalk.bold.yellow('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  console.log('  Here are some commands you can try right now:\n');
  console.log(chalk.cyan('    git show changes'));
  console.log(chalk.gray('    See what files you\'ve modified\n'));
  console.log(chalk.cyan('    git show history'));
  console.log(chalk.gray('    See your recent commits\n'));
  console.log(chalk.cyan('    git show branches'));
  console.log(chalk.gray('    See all your branches\n'));
  console.log('  Go ahead, try one after this tour!');
  console.log('');

  await sleep(4000);

  // Step 5: See All Commands
  console.log(chalk.bold.yellow('\n  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.bold.yellow('  STEP 5: SEE ALL AVAILABLE COMMANDS'));
  console.log(chalk.bold.yellow('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  console.log('  Don\'t know what commands are available?');
  console.log('  There are two ways to find out:\n');
  console.log(chalk.bold('  Option A: Built-in help'));
  console.log(chalk.cyan('    git help           ') + chalk.gray('See all git commands'));
  console.log(chalk.cyan('    npm help           ') + chalk.gray('See all npm commands'));
  console.log(chalk.cyan('    docker help        ') + chalk.gray('See all docker commands'));
  console.log('');
  console.log(chalk.bold('  Option B: Learn mode (browse without using friendly commands)'));
  console.log(chalk.cyan('    friendly learn git ') + chalk.gray('Browse git commands'));
  console.log(chalk.cyan('    friendly learn all ') + chalk.gray('Browse everything'));
  console.log('');
  console.log('  Both show you nice tables with:');
  console.log('    - The friendly command');
  console.log('    - The traditional command');
  console.log('    - What it does');
  console.log('');

  await sleep(5000);

  // Step 6: Learn Mode Explained
  console.log(chalk.bold.yellow('\n  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.bold.yellow('  STEP 6: LEARN MODE - USE IT AS A CHEAT SHEET'));
  console.log(chalk.bold.yellow('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  console.log('  Maybe you don\'t want to use friendly commands.');
  console.log('  Maybe you just want to see what commands exist.');
  console.log('  ');
  console.log('  ' + chalk.bold('That\'s totally fine!'));
  console.log('  ');
  console.log('  Learn mode is like a cheat sheet built into your terminal.');
  console.log('  Run it, look up the traditional command, and use that directly.\n');
  console.log(chalk.cyan('    $ friendly learn git'));
  console.log('');
  console.log('    ' + chalk.gray('┌─────────────────────┬─────────────────────┬──────────────┐'));
  console.log('    ' + chalk.gray('│ Friendly Command    │ Actual Command      │ What It Does │'));
  console.log('    ' + chalk.gray('├─────────────────────┼─────────────────────┼──────────────┤'));
  console.log('    ' + chalk.gray('│ git show changes    │ git status          │ Show changes │'));
  console.log('    ' + chalk.gray('│ git sync upload     │ git push            │ Upload code  │'));
  console.log('    ' + chalk.gray('└─────────────────────┴─────────────────────┴──────────────┘'));
  console.log('');
  console.log('  Now you know: "git status" shows changes.');
  console.log('  Use "git status" directly if you prefer!');
  console.log('');

  await sleep(5000);

  // Step 7: Switch Modes
  console.log(chalk.bold.yellow('\n  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.bold.yellow('  STEP 7: SWITCH BETWEEN FRIENDLY AND TRADITIONAL'));
  console.log(chalk.bold.yellow('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  console.log('  You can switch modes anytime. No need to uninstall.\n');
  console.log(chalk.bold('  Friendly Mode') + chalk.gray(' (what you have now)'));
  console.log('    - "git show changes" becomes "git status"');
  console.log('    - Commands are translated for you');
  console.log('');
  console.log(chalk.bold('  Traditional Mode'));
  console.log('    - "git status" stays "git status"');
  console.log('    - Commands pass through unchanged');
  console.log('    - Help and learn still work!');
  console.log('');
  console.log('  To switch:\n');
  console.log(chalk.cyan('    friendly mode              ') + chalk.gray('See current mode'));
  console.log(chalk.cyan('    friendly mode traditional  ') + chalk.gray('Switch to traditional'));
  console.log(chalk.cyan('    friendly mode friendly     ') + chalk.gray('Switch back to friendly'));
  console.log('');
  console.log('  ' + chalk.bold('Why switch to traditional?'));
  console.log('    - Working on someone else\'s computer');
  console.log('    - Pair programming with someone who prefers traditional');
  console.log('    - Practicing for a job interview');
  console.log('    - You just want the cheat sheet, not the translations');
  console.log('');

  await sleep(5000);

  // Step 8: Supported Tools
  console.log(chalk.bold.yellow('\n  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.bold.yellow('  STEP 8: WHAT TOOLS ARE SUPPORTED?'));
  console.log(chalk.bold.yellow('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  console.log('  Friendly Terminal works with these tools:\n');
  console.log(chalk.cyan('    git      ') + chalk.gray('Version control'));
  console.log(chalk.gray('             Track changes, collaborate with your team'));
  console.log('');
  console.log(chalk.cyan('    npm      ') + chalk.gray('Node.js package manager'));
  console.log(chalk.gray('             Install libraries, run scripts'));
  console.log('');
  console.log(chalk.cyan('    gradle   ') + chalk.gray('Java/Android build tool'));
  console.log(chalk.gray('             Build and run Java/Android apps'));
  console.log('');
  console.log(chalk.cyan('    maven    ') + chalk.gray('Java build tool'));
  console.log(chalk.gray('             Another way to build Java projects'));
  console.log('');
  console.log(chalk.cyan('    docker   ') + chalk.gray('Container platform'));
  console.log(chalk.gray('             Run apps in isolated containers'));
  console.log('');
  console.log(chalk.cyan('    files    ') + chalk.gray('File operations'));
  console.log(chalk.gray('             Search and view files'));
  console.log('');

  await sleep(4000);

  // Final: What to do next
  console.log(chalk.bold.yellow('\n  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.bold.yellow('  YOU\'RE READY!'));
  console.log(chalk.bold.yellow('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

  console.log('  Here\'s what to try next:\n');
  console.log(chalk.cyan('    git show changes     ') + chalk.gray('See what files you changed'));
  console.log(chalk.cyan('    git help             ') + chalk.gray('See all git commands'));
  console.log(chalk.cyan('    friendly learn git   ') + chalk.gray('Browse the cheat sheet'));
  console.log(chalk.cyan('    friendly mode        ') + chalk.gray('Check your current mode'));
  console.log('');
  console.log('  ' + chalk.bold('Remember:'));
  console.log('    - Every command shows what it\'s really running');
  console.log('    - Use "git help" or "friendly learn git" when you forget');
  console.log('    - Switch to traditional mode anytime with "friendly mode traditional"');
  console.log('');

  console.log(chalk.green('  ╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.green('  ║                                                            ║'));
  console.log(chalk.green('  ║   Tour complete! Happy coding!                             ║'));
  console.log(chalk.green('  ║                                                            ║'));
  console.log(chalk.green('  ║   Run "friendly tour" anytime to see this again.           ║'));
  console.log(chalk.green('  ║                                                            ║'));
  console.log(chalk.green('  ╚════════════════════════════════════════════════════════════╝'));
  console.log('');
}

// Quick version without delays
function runQuickTour() {
  printLogo();

  console.log(chalk.green('  ╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.green('  ║                                                            ║'));
  console.log(chalk.green('  ║   Friendly Terminal - Quick Start                          ║'));
  console.log(chalk.green('  ║                                                            ║'));
  console.log(chalk.green('  ╚════════════════════════════════════════════════════════════╝'));
  console.log('');

  console.log(chalk.bold.yellow('  WHAT IS THIS?\n'));
  console.log('  Type readable commands. We translate them for you.');
  console.log('  And we show you the real command, so you learn!\n');
  console.log('    ' + chalk.cyan('git show changes') + '  →  ' + chalk.gray('git status'));
  console.log('    ' + chalk.cyan('git save "msg"') + '    →  ' + chalk.gray('git add . && git commit -m "msg"'));
  console.log('    ' + chalk.cyan('git sync upload') + '   →  ' + chalk.gray('git push'));
  console.log('    ' + chalk.cyan('npm setup') + '         →  ' + chalk.gray('npm install'));
  console.log('');

  console.log(chalk.bold.yellow('  SEE ALL COMMANDS\n'));
  console.log('    ' + chalk.cyan('git help') + '              All git commands in a table');
  console.log('    ' + chalk.cyan('npm help') + '              All npm commands');
  console.log('    ' + chalk.cyan('friendly learn git') + '    Browse git as a cheat sheet');
  console.log('    ' + chalk.cyan('friendly learn all') + '    Browse everything');
  console.log('');

  console.log(chalk.bold.yellow('  SWITCH MODES\n'));
  console.log('  Don\'t want friendly commands? Switch to traditional:\n');
  console.log('    ' + chalk.cyan('friendly mode') + '               See current mode');
  console.log('    ' + chalk.cyan('friendly mode traditional') + '   Commands pass through unchanged');
  console.log('    ' + chalk.cyan('friendly mode friendly') + '      Back to friendly commands');
  console.log('');
  console.log('  ' + chalk.gray('In traditional mode, help and learn still work!'));
  console.log('');

  console.log(chalk.bold.yellow('  SUPPORTED TOOLS\n'));
  console.log('    ' + chalk.cyan('git') + '       Version control');
  console.log('    ' + chalk.cyan('npm') + '       Node.js packages');
  console.log('    ' + chalk.cyan('gradle') + '    Java/Android builds');
  console.log('    ' + chalk.cyan('maven') + '     Java builds');
  console.log('    ' + chalk.cyan('docker') + '    Containers');
  console.log('    ' + chalk.cyan('files') + '     File search');
  console.log('');

  console.log(chalk.bold.yellow('  TRY NOW\n'));
  console.log('    ' + chalk.cyan('git show changes') + '     See modified files');
  console.log('    ' + chalk.cyan('git help') + '             See all commands');
  console.log('    ' + chalk.cyan('friendly tour') + '        Full interactive tour');
  console.log('');
}

module.exports = { runTour, runQuickTour };
