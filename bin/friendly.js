#!/usr/bin/env node

const { main } = require('../src/index');

// Get command line arguments (skip node and script path)
const args = process.argv.slice(2);

main(args);
