#!/usr/bin/env node
import commander from 'commander';
import generateDiff from '..';

const program = new commander.Command();
program
  .version('1.0.5')
  .usage('[options] <firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .action((firstConfig, secondConfig) => {
    console.log(generateDiff(firstConfig, secondConfig));
  });
program.parse(process.argv);
