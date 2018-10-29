#!/usr/bin/env node

const program = require('commander');

program
    .version('1.0.5')
    .usage('[options] <firstConfig> <secondConfig>')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'Output format');

program.parse(process.argv);
