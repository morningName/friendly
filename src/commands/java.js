const { execSync } = require('child_process');
const { printCommand, printError, printSuccess } = require('../utils/ascii');
const { printTable } = require('../utils/table');

// Java command mappings
const javaCommands = {
  'show runtime version': { cmd: 'java -version', desc: 'Shows installed Java runtime version' },
  'show compiler version': { cmd: 'javac -version', desc: 'Shows Java compiler version' },
  'show installation path': { cmd: 'echo $JAVA_HOME', desc: 'Shows where Java is installed' },
  'show classpath': { cmd: 'echo $CLASSPATH', desc: 'Shows current classpath' },
};

// Commands that need arguments
function getCommandWithArgs(command, args) {
  const argStr = args.join(' ');

  // COMPILING
  if (command === 'compile' && args.length >= 1) {
    const file = args[0];
    return { cmd: `javac ${file}`, desc: 'Compiles Java source file' };
  }

  if (command === 'compile' && args[0] === 'all') {
    return { cmd: 'javac *.java', desc: 'Compiles all Java files in current directory' };
  }

  if (command === 'compile with classpath' || command === 'compile with cp') {
    // java compile with classpath lib/* MyFile.java
    const cpIndex = args.indexOf('classpath') !== -1 ? args.indexOf('classpath') : args.indexOf('cp');
    if (args.length >= 2) {
      const classpath = args[0];
      const file = args.slice(1).join(' ');
      return { cmd: `javac -cp ${classpath} ${file}`, desc: 'Compiles with specified classpath' };
    }
  }

  if (command === 'compile with sourcepath') {
    if (args.length >= 2) {
      const sourcepath = args[0];
      const file = args.slice(1).join(' ');
      return { cmd: `javac -sourcepath ${sourcepath} ${file}`, desc: 'Compiles with specified source path' };
    }
  }

  if (command === 'compile to') {
    // java compile to build/ MyFile.java
    if (args.length >= 2) {
      const outputDir = args[0];
      const file = args.slice(1).join(' ');
      return { cmd: `javac -d ${outputDir} ${file}`, desc: 'Compiles to specified output directory' };
    }
  }

  // RUNNING
  if (command === 'run' && args.length >= 1) {
    const className = args[0];
    return { cmd: `java ${className}`, desc: 'Runs a compiled Java class' };
  }

  if (command === 'run with classpath' || command === 'run with cp') {
    if (args.length >= 2) {
      const classpath = args[0];
      const className = args.slice(1).join(' ');
      return { cmd: `java -cp ${classpath} ${className}`, desc: 'Runs with specified classpath' };
    }
  }

  if (command === 'run jar') {
    if (args.length >= 1) {
      const jarFile = args[0];
      return { cmd: `java -jar ${jarFile}`, desc: 'Runs a JAR file' };
    }
  }

  if (command === 'run with memory') {
    // java run with memory 512m MyClass
    if (args.length >= 2) {
      const memory = args[0];
      const className = args.slice(1).join(' ');
      return { cmd: `java -Xmx${memory} ${className}`, desc: 'Runs with specified max memory' };
    }
  }

  // JAR OPERATIONS
  if (command === 'create jar') {
    // java create jar myapp.jar *.class
    if (args.length >= 2) {
      const jarName = args[0];
      const files = args.slice(1).join(' ');
      return { cmd: `jar cvf ${jarName} ${files}`, desc: 'Creates a JAR archive' };
    }
  }

  if (command === 'create jar with manifest') {
    // java create jar with manifest MANIFEST.MF myapp.jar *.class
    if (args.length >= 3) {
      const manifest = args[0];
      const jarName = args[1];
      const files = args.slice(2).join(' ');
      return { cmd: `jar cvfm ${jarName} ${manifest} ${files}`, desc: 'Creates JAR with manifest' };
    }
  }

  if (command === 'extract jar') {
    if (args.length >= 1) {
      const jarFile = args[0];
      return { cmd: `jar xvf ${jarFile}`, desc: 'Extracts JAR contents' };
    }
  }

  if (command === 'show jar') {
    if (args.length >= 1) {
      const jarFile = args[0];
      return { cmd: `jar tvf ${jarFile}`, desc: 'Lists JAR contents' };
    }
  }

  if (command === 'show jar manifest') {
    if (args.length >= 1) {
      const jarFile = args[0];
      return { cmd: `unzip -p ${jarFile} META-INF/MANIFEST.MF`, desc: 'Shows JAR manifest file' };
    }
  }

  // CLASSPATH HELPERS
  if (command === 'find class') {
    if (args.length >= 1) {
      const className = args[0];
      return { cmd: `find . -name "${className}.class"`, desc: 'Finds compiled class file' };
    }
  }

  if (command === 'find source') {
    if (args.length >= 1) {
      const className = args[0];
      return { cmd: `find . -name "${className}.java"`, desc: 'Finds Java source file' };
    }
  }

  return null;
}

function executeJava(args) {
  const fullCommand = args.join(' ').trim();

  // Check for help
  if (fullCommand === 'help' || fullCommand === '') {
    return printJavaHelp();
  }

  // Check exact matches first
  if (javaCommands[fullCommand]) {
    const { cmd } = javaCommands[fullCommand];
    return runCommand(cmd);
  }

  // Check commands with arguments
  // Try different command patterns
  const patterns = [
    'compile with classpath', 'compile with cp', 'compile with sourcepath',
    'compile to', 'compile all', 'compile',
    'run with classpath', 'run with cp', 'run with memory', 'run jar', 'run',
    'create jar with manifest', 'create jar',
    'extract jar', 'show jar manifest', 'show jar',
    'find class', 'find source'
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

  // Not found - pass through to real java command
  printCommand('java ' + fullCommand);
  try {
    execSync('java ' + fullCommand, { encoding: 'utf-8', stdio: 'inherit' });
  } catch (e) {
    // java already printed the error
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

function printJavaHelp() {
  const headers = ['Friendly Command', 'Actual Command', 'What It Does'];
  const colWidths = [35, 40, 45];

  const rows = [
    ['COMPILING', '', ''],
    ['java compile MyFile.java', 'javac MyFile.java', 'Compiles a single Java file'],
    ['java compile *.java', 'javac *.java', 'Compiles all Java files'],
    ['java compile to build/ MyFile.java', 'javac -d build/ MyFile.java', 'Compiles to output directory'],
    ['java compile with cp lib/* App.java', 'javac -cp lib/* App.java', 'Compiles with classpath'],
    ['', '', ''],
    ['RUNNING', '', ''],
    ['java run MyClass', 'java MyClass', 'Runs a compiled class'],
    ['java run with cp lib/* MyClass', 'java -cp lib/* MyClass', 'Runs with classpath'],
    ['java run jar myapp.jar', 'java -jar myapp.jar', 'Runs a JAR file'],
    ['java run with memory 512m MyClass', 'java -Xmx512m MyClass', 'Runs with max memory limit'],
    ['', '', ''],
    ['JAR OPERATIONS', '', ''],
    ['java create jar app.jar *.class', 'jar cvf app.jar *.class', 'Creates a JAR archive'],
    ['java create jar with manifest ...', 'jar cvfm app.jar MANIFEST ...', 'Creates JAR with manifest'],
    ['java extract jar app.jar', 'jar xvf app.jar', 'Extracts JAR contents'],
    ['java show jar app.jar', 'jar tvf app.jar', 'Lists files inside JAR'],
    ['java show jar manifest app.jar', 'unzip -p app.jar META-INF/...', 'Shows the manifest file'],
    ['', '', ''],
    ['VERSION & PATHS', '', ''],
    ['java show runtime version', 'java -version', 'Shows Java runtime version'],
    ['java show compiler version', 'javac -version', 'Shows Java compiler version'],
    ['java show installation path', 'echo $JAVA_HOME', 'Shows Java installation path'],
    ['java show classpath', 'echo $CLASSPATH', 'Shows current classpath'],
    ['', '', ''],
    ['FINDING FILES', '', ''],
    ['java find class MyClass', 'find . -name "MyClass.class"', 'Finds compiled .class file'],
    ['java find source MyClass', 'find . -name "MyClass.java"', 'Finds Java source file'],
  ];

  console.log('');
  printTable('JAVA COMMANDS', headers, rows, colWidths);
  console.log('');

  // Extra tips
  console.log('  CLASSPATH TIPS:');
  console.log('  ─────────────────────────────────────────────────────────────────');
  console.log('  • Classpath tells Java where to find your .class files and libraries');
  console.log('  • Use "." for current directory: java -cp . MyClass');
  console.log('  • Use ":" (Mac/Linux) or ";" (Windows) to separate multiple paths');
  console.log('  • Example: java -cp .:lib/*:bin MyClass');
  console.log('  • Use "*" to include all JARs in a folder: java -cp "lib/*" MyClass');
  console.log('');
}

module.exports = {
  executeJava,
  printJavaHelp
};
