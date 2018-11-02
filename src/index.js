import fs from 'fs';
import path from 'path';
import { _, has } from 'lodash';
import parseFileData from './parsers';


const getKeyDiffStr = ({ key, values }) => values.reduce((acc, item) => `${acc}\n${item.prefix}${key}: ${item.value}`, '');


const readFile = (fileName) => {
  const pathAbsolute = path.isAbsolute(fileName) ? fileName : path.resolve(__dirname, fileName);
  return {
    str: fs.readFileSync(pathAbsolute, 'utf8'),
    type: path.extname(fileName),
  };
};


export default (path1, path2) => {
  const obj1 = parseFileData(readFile(path1));
  const obj2 = parseFileData(readFile(path2));
  const keysArr = _.uniq(Object.keys(obj1).concat(Object.keys(obj2)));

  const keysObjects = keysArr.map((key) => {
    const values = [];
    if (has(obj1, key)) {
      values.push({ value: obj1[key], prefix: (obj1[key] === obj2[key] ? '  ' : '- ') });
    }
    if (has(obj2, key)) {
      values.push({ value: obj2[key], prefix: (obj1[key] === obj2[key] ? '  ' : '+ ') });
    }
    return { key, values: _.uniqBy(values, 'value') };
  });

  const propsStr = keysObjects.reduce((acc, item) => `${acc}${getKeyDiffStr(item)}`, '');
  const res = `{${propsStr}\n}\n`;
  return res;
};
