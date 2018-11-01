import * as commander from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import parse from './parsers';


const getFileValue = (config) => {
  const configPath = path.isAbsolute(config) ? config : path.resolve(__dirname, config);
  const str = fs.readFileSync(configPath, 'utf8');
  const type = path.extname(config);
  return type === '.json' ? JSON.parse(str) : yaml.safeLoad(str);
};


const generator = (firstConfig, secondConfig) => {
  const res = parse(getFileValue(firstConfig), getFileValue(secondConfig));
  console.log('RESULT:');
  console.log(res);
  return res;
};


export const initGendiff = () => {
  const program = new commander.Command();
  program
    .version('1.0.5')
    .usage('[options] <firstConfig> <secondConfig>')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'Output format')
    .action(generator);
  program.parse(process.argv);
};


export default generator;
