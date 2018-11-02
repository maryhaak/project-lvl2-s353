import { _, has } from 'lodash';
import parseFile from './parsers';

const getKeyDiffStr = ({ key, values }) => values.reduce((acc, item) => `${acc}\n${item.prefix}${key}: ${item.value}`, '');

export default (path1, path2) => {
  const obj1 = parseFile(path1);
  const obj2 = parseFile(path2);
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
