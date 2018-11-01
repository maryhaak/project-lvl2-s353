import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const mapping = {
  '.json': str => JSON.parse(str),
  '.yml': str => yaml.safeLoad(str)
};

export default (fileName) => {
  const pathAbsolute = path.isAbsolute(fileName) ? fileName : path.resolve(__dirname, fileName);
  const str = fs.readFileSync(pathAbsolute, 'utf8');
  return mapping[path.extname(fileName)](str);
};
