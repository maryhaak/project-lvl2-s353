#!/usr/bin/env node
import generator from './generator';

const initGendiff = () => {    
    const program = require('commander');

    program
        .version('1.0.5')
        .usage('[options] <firstConfig> <secondConfig>')
        .description('Compares two configuration files and shows a difference.')
        .option('-f, --format [type]', 'Output format')
        .action(generator);

    program.parse(process.argv);
};

initGendiff();
