import fs from 'fs';
import path from 'path';
import { _, has } from 'lodash';
import getFileDataAsObj from './parsers';
import render from './render';


const parse = (obj1, obj2) => {
  const keysArr = _.uniq(Object.keys(obj1).concat(Object.keys(obj2)));

  const keysDiff = keysArr.map((key) => {
    const hasFirst = has(obj1, key);
    const hasSecond = has(obj2, key);
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (_.isObject(val1) && _.isObject(val2)) {
      return { key, status: 'unchanged', value: parse(val1, val2) };
    }

    if (val1 === val2) {
      return { key, status: 'unchanged', value: val1 };
    }

    if (hasSecond && !hasFirst) {
      return { key, status: 'added', value: val2 };
    }

    if (!hasSecond && hasFirst) {
      return { key, status: 'removed', value: val1 };
    }

    return {
      key, status: 'changed', val1, val2,
    };
  });

  return keysDiff;
};


export default (path1, path2, renderType) => {
  const obj1 = getFileDataAsObj(fs.readFileSync(path1, 'utf8'), path.extname(path1));
  const obj2 = getFileDataAsObj(fs.readFileSync(path2, 'utf8'), path.extname(path2));
  return `${render(parse(obj1, obj2), renderType)}`;
};
