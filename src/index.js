import fs from 'fs';
import path from 'path';
import { _, has } from 'lodash';
import getFileDataAsObj from './parsers';


const prefixes = {
  added: '+ ',
  removed: '- ',
  unchanged: '  ',
  tab: '    ',
  indent: '  ',
};


const stringify = (obj, indent) => Object.keys(obj).reduce((acc, key) => `${acc}${indent}${prefixes.indent}${key}: ${obj[key]}\n`, '');


const render = (data, depth = 0) => {
  const getValStr = value => (_.isObject(value) ? render(value, depth + 1) : value);
  const indent = prefixes.tab.repeat(depth);

  const keysStr = _.isArray(data)
    ? data.reduce((acc, item) => {
      const {
        key,
        status,
      } = item;

      const keyDiff = status === 'changed'
        ? `${indent}${prefixes.removed}${key}: ${getValStr(item.val1)}\n${indent}${prefixes.added}${key}: ${getValStr(item.val2)}\n`
        : `${indent}${status ? prefixes[status] : prefixes.indent}${key}: ${getValStr(item.value)}\n`;

      return `${acc}${keyDiff}`;
    }, '')
    : stringify(data, indent);

  const closingBracketIndent = depth > 0 ? `${prefixes.indent}${prefixes.tab.repeat(depth - 1)}` : '';
  return `{\n${keysStr}${closingBracketIndent}}`;
};


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


export default (path1, path2) => {
  const obj1 = getFileDataAsObj(fs.readFileSync(path1, 'utf8'), path.extname(path1));
  const obj2 = getFileDataAsObj(fs.readFileSync(path2, 'utf8'), path.extname(path2));
  return `${render(parse(obj1, obj2))}\n`;
};
