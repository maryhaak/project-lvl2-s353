#!/usr/bin/env node

const program = require('commander');

program
  .version('1.0.3')
  .option('-f, --format [type]', 'Output format')
  .parse(process.argv);
