#!/usr/bin/env node
import commander from 'commander';
import path from 'path';
import genDiff from '..';

const program = new commander.Command();
program
  .version('1.0.5')
  .usage('[options] <firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .action((firstConfig, secondConfig) => {
    const normalizePath = curPath => (path.isAbsolute(curPath)
      ? curPath
      : path.resolve(process.cwd(), curPath));
    console.log(genDiff(normalizePath(firstConfig), normalizePath(secondConfig), program.format));
  });
program.parse(process.argv);
