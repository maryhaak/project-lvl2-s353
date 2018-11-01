import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import parse from './parsers';


const getFileValue = (config) => {
  const configPath = path.isAbsolute(config) ? config : path.resolve(__dirname, config);
  const str = fs.readFileSync(configPath, 'utf8');
  const type = path.extname(config);
  return type === '.json' ? JSON.parse(str) : yaml.safeLoad(str);
};


export default (firstConfig, secondConfig) => {
  const res = parse(getFileValue(firstConfig), getFileValue(secondConfig));
  console.log('RESULT:');
  console.log(res);
  return res;
};
