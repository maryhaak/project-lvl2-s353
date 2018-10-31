#!/usr/bin/env node
import * as commander from 'commander';
import generator from './generator';

const initGendiff = () => {
  const program = new commander.Command();

  program
    .version('1.0.5')
    .usage('[options] <firstConfig> <secondConfig>')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'Output format')
    .action(generator);

  program.parse(process.argv);
};

initGendiff();
