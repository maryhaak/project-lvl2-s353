#!/usr/bin/env node
import generator from './generator';
import * as commander from 'commander';

const initGendiff = () => {
    program
        .version('1.0.5')
        .usage('[options] <firstConfig> <secondConfig>')
        .description('Compares two configuration files and shows a difference.')
        .option('-f, --format [type]', 'Output format')
        .action(generator);

    program.parse(process.argv);
};

initGendiff();
