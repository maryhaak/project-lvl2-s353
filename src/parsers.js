import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';


export default (fileName) => {
  const pathAbsolute = path.isAbsolute(fileName) ? fileName : path.resolve(__dirname, fileName);
  const str = fs.readFileSync(pathAbsolute, 'utf8');
  const type = path.extname(fileName);
  return type === '.json' ? JSON.parse(str) : yaml.safeLoad(str);
};
