import fs from 'fs';
import path from 'path';
import { _, has } from 'lodash';
import parseFileData from './parsers';


const getKeyDiffStr = ({ key, values }) => values.reduce((acc, item) => `${acc}\n${item.prefix}${key}: ${item.value}`, '');


const readFile = (fileName) => {
  const pathAbsolute = path.isAbsolute(fileName) ? fileName : path.resolve(__dirname, fileName);
  return fs.readFileSync(pathAbsolute, 'utf8');
};


const getPrefix = (key, value, obj1, obj2) => {
  if (obj1[key] === obj2[key]) {
    return '  ';
  }
  return (obj1[key] === value) ? '- ' : '+ ';
};


export default (path1, path2) => {
  const obj1 = parseFileData(readFile(path1), path.extname(path1));
  const obj2 = parseFileData(readFile(path2), path.extname(path2));
  const keysArr = _.uniq(Object.keys(obj1).concat(Object.keys(obj2)));

  const keysObjects = keysArr.map((key) => {
    const values = [];
    if (has(obj1, key)) {
      values.push({ value: obj1[key], prefix: getPrefix(key, obj1[key], obj1, obj2) });
    }
    if (has(obj2, key)) {
      values.push({ value: obj2[key], prefix: getPrefix(key, obj2[key], obj1, obj2) });
    }
    return { key, values: _.uniqBy(values, 'value') };
  });

  const propsStr = keysObjects.reduce((acc, item) => `${acc}${getKeyDiffStr(item)}`, '');
  const res = `{${propsStr}\n}\n`;
  return res;
};
