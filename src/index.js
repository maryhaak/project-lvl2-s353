import _ from 'lodash';
import {has, uniq} from 'lodash';
import parseFile from './parsers';


const detectPrefix = (key, value, obj1, obj2) => (obj1[key] === obj2[key]) ? '  ' : ( obj1[key] === value ? '- ' : '+ ');

const getKeyDiffStr = ({key, values}) => values.reduce((acc, item) =>
                                        `${acc}\n${item.prefix}${key}: ${item.value}`,
                                        '');

export default (path1, path2) => {
  const obj1 = parseFile(path1);
  const obj2 = parseFile(path2);
  const keysArr = _.uniq(Object.keys(obj1).concat(Object.keys(obj2)));

  const keysObjects = keysArr.map(key => {
    const values = [];
    if (has(obj1, key)) {
      values.push({value: obj1[key], prefix: detectPrefix(key, obj1[key], obj1, obj2)});
    }
    if (has(obj2, key)) {
      values.push({value: obj2[key], prefix: detectPrefix(key, obj2[key], obj1, obj2)});
    }
    return { key: key, values: _.uniqBy(values, 'value') };
  });

  const propsStr = keysObjects.reduce((acc, item) => `${acc}${getKeyDiffStr(item)}`, '');
  const res = `{${propsStr}\n}\n`;
  return res;
};
