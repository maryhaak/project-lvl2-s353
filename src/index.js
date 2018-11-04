import fs from 'fs';
import path from 'path';
import { _, has } from 'lodash';
import getFileDataAsObj from './parsers';
import render from './render';


const diffStatuses = [
  {
    name: 'unchanged',
    check: (hasFirst, hasSecond, v1, v2) => (v1 === v2 || (_.isObject(v1) && _.isObject(v2))),
  },
  {
    name: 'removed',
    check: (hasFirst, hasSecond) => !hasSecond && hasFirst,
  },
  {
    name: 'added',
    check: (hasFirst, hasSecond) => hasSecond && !hasFirst,
  },
  {
    name: 'changed',
    check: (hasFirst, hasSecond, v1, v2) => (hasFirst && hasSecond && (v1 !== v2)),
  },
];


const parse = (obj1, obj2) => {
  const keysArr = _.uniq(Object.keys(obj1).concat(Object.keys(obj2)));

  const keysDiff = keysArr.map((key) => {
    const hasFirst = has(obj1, key);
    const hasSecond = has(obj2, key);
    const val1 = obj1[key];
    const val2 = obj2[key];
    const status = diffStatuses.find(({ check }) => check(hasFirst, hasSecond, val1, val2)).name;

    if (status === 'added' || status === 'removed') {
      const value = status === 'removed' ? val1 : val2;
      return { key, status, value };
    }

    if (status === 'unchanged') {
      const value = (val1 === val2) ? val1 : parse(val1, val2);
      return { key, status, value };
    }

    return {
      key, status, val1, val2,
    };
  });

  return keysDiff;
};


export default (path1, path2, renderType) => {
  const obj1 = getFileDataAsObj(fs.readFileSync(path1, 'utf8'), path.extname(path1));
  const obj2 = getFileDataAsObj(fs.readFileSync(path2, 'utf8'), path.extname(path2));
  return `${render(parse(obj1, obj2), renderType)}`;
};
