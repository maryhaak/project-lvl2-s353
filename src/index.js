import fs from 'fs';
import path from 'path';
import { _, has } from 'lodash';
import getFileDataAsObj from './parsers';


const getKeyDiffStr = ({ key, values }) => values.reduce((acc, item) => (item !== null
  ? `${acc}\n${item.prefix}${key}: ${item.value}`
  : acc), '');


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


const getValueData = (key, curObj, obj1, obj2) => (has(curObj, key)
  ? { value: curObj[key], prefix: getPrefix(key, curObj[key], obj1, obj2) }
  : null);


export default (path1, path2) => {
  const obj1 = getFileDataAsObj(readFile(path1), path.extname(path1));
  const obj2 = getFileDataAsObj(readFile(path2), path.extname(path2));
  const keysArr = _.uniq(Object.keys(obj1).concat(Object.keys(obj2)));

  const keysObjects = keysArr.map((key) => {
    const values = [getValueData(key, obj1, obj1, obj2), getValueData(key, obj2, obj1, obj2)];
    return { key, values: _.uniqBy(values, 'value') };
  });

  const propsStr = keysObjects.reduce((acc, item) => `${acc}${getKeyDiffStr(item)}`, '');
  const res = `{${propsStr}\n}\n`;
  return res;
};
