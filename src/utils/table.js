const chalk = require('chalk');

/**
 * Prints a formatted table to the console
 * @param {string} title - Table title
 * @param {Array} headers - Column headers
 * @param {Array} rows - Array of row arrays
 * @param {Array} colWidths - Width of each column
 */
function printTable(title, headers, rows, colWidths) {
  const totalWidth = colWidths.reduce((a, b) => a + b, 0) + colWidths.length + 1;

  // Top border
  console.log('┌' + '─'.repeat(totalWidth - 2) + '┐');

  // Title
  if (title) {
    const titlePadding = totalWidth - 4 - title.length;
    console.log('│ ' + chalk.bold.cyan(title) + ' '.repeat(titlePadding) + ' │');
    console.log('├' + colWidths.map(w => '─'.repeat(w)).join('┬') + '┤');
  }

  // Headers
  let headerRow = '│';
  headers.forEach((header, i) => {
    const padding = colWidths[i] - header.length - 2;
    headerRow += ' ' + chalk.bold(header) + ' '.repeat(padding) + ' │';
  });
  console.log(headerRow);
  console.log('├' + colWidths.map(w => '─'.repeat(w)).join('┼') + '┤');

  // Rows
  rows.forEach(row => {
    // Check if it's a section header (empty actual command)
    if (row.length === 1 || (row[1] === '' && row[2] === '')) {
      // Section header
      console.log('│' + ' '.repeat(totalWidth - 2) + '│');
      const sectionTitle = row[0];
      const sectionPadding = colWidths[0] - sectionTitle.length - 2;
      console.log('│ ' + chalk.bold.yellow(sectionTitle) + ' '.repeat(sectionPadding) + ' │' +
                  ' '.repeat(colWidths[1]) + '│' + ' '.repeat(colWidths[2]) + '│');
    } else {
      let rowStr = '│';
      row.forEach((cell, i) => {
        const cellStr = String(cell);
        const padding = colWidths[i] - cellStr.length - 2;
        if (i === 0) {
          // Friendly command - green
          rowStr += ' ' + chalk.green(cellStr) + ' '.repeat(Math.max(0, padding)) + ' │';
        } else if (i === 1) {
          // Actual command - bright white
          rowStr += ' ' + chalk.whiteBright(cellStr) + ' '.repeat(Math.max(0, padding)) + ' │';
        } else {
          // Description - white
          rowStr += ' ' + cellStr + ' '.repeat(Math.max(0, padding)) + ' │';
        }
      });
      console.log(rowStr);
    }
  });

  // Bottom border
  console.log('└' + colWidths.map(w => '─'.repeat(w)).join('┴') + '┘');
}

/**
 * Prints a simple key-value table
 */
function printSimpleTable(items) {
  const maxKeyLength = Math.max(...items.map(i => i.key.length));

  items.forEach(item => {
    const padding = maxKeyLength - item.key.length;
    console.log('  ' + chalk.green(item.key) + ' '.repeat(padding) + '  ' + chalk.white(item.value));
  });
}

module.exports = {
  printTable,
  printSimpleTable
};
