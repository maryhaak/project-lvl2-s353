import fs from 'fs';
import path from 'path';
import { _, has } from 'lodash';
import getFileDataAsObj from './parsers';


const prefixes = {
  added: '+ ',
  removed: '- ',
  unchanged: '  ',
};


const render = (data) => {
  const getValStr = value => (_.isObject(value) ? render(value) : value);

  const keysStr = data.reduce((acc, item) => {
    const {
      key,
      status,
    } = item;

    const keyDiff = status === 'changed'
      ? `${prefixes.removed}${key}: ${getValStr(item.value1)}\n${prefixes.added}${key}: ${getValStr(item.value2)}\n`
      : `${prefixes[status]}${key}: ${getValStr(item.value)}\n`;

    return `${acc}${keyDiff}`;
  }, '');
  return `{\n${keysStr}}\n`;
};


const parse = (obj1, obj2) => {
  const keysArr = _.uniq(Object.keys(obj1).concat(Object.keys(obj2)));
  const keysDiff = keysArr.map((key) => {
    const hasFirst = has(obj1, key);
    const hasSecond = has(obj2, key);
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (!hasSecond || !hasFirst) {
      const status = hasFirst ? 'removed' : 'added';
      const value = hasFirst ? value1 : value2;
      return { key, status, value };
    }

    if (value1 === value2 || (_.isObject(value1) && _.isObject(value2))) {
      const status = 'unchanged';
      const value = (value1 === value2) ? value1 : parse(value1, value2);
      return { key, status, value };
    }

    const status = 'changed';
    return {
      key, status, value1, value2,
    };
  });
  return keysDiff;
};


export default (path1, path2) => {
  const obj1 = getFileDataAsObj(fs.readFileSync(path1, 'utf8'), path.extname(path1));
  const obj2 = getFileDataAsObj(fs.readFileSync(path2, 'utf8'), path.extname(path2));
  return render(parse(obj1, obj2));
};
