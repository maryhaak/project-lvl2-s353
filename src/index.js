import _ from 'lodash';
import has from 'lodash/has';
import parseFile from './parsers';


const combineKeyObj = (keysArr, beforeObj, afterObj, keysBelongTo) => keysArr.map((key) => {
  const obj = { key };
  obj.val = keysBelongTo === 'before' ? beforeObj[key] : afterObj[key];
  /* detect prefix */
  if (has(beforeObj, key) && has(afterObj, key)) {
    if (beforeObj[key] !== afterObj[key]) {
      obj.prefix = keysBelongTo === 'before' ? '- ' : '+ ';
    } else {
      obj.prefix = '  ';
    }
  } else if (has(beforeObj, key) && !has(afterObj, key)) {
    obj.prefix = '- ';
  } else if (!has(beforeObj, key) && has(afterObj, key)) {
    obj.prefix = '+ ';
  }
  return obj;
});


export default (firstConfig, secondConfig) => {
  const beforeObj = parseFile(firstConfig);
  const afterObj = parseFile(secondConfig);
  const beforeKeysObjArr = combineKeyObj(Object.keys(beforeObj), beforeObj, afterObj, 'before');
  const afterKeysObjArr = combineKeyObj(Object.keys(afterObj), beforeObj, afterObj, 'after');
  const diffArr = beforeKeysObjArr.concat(afterKeysObjArr);

  diffArr.sort((a, b) => {
    if (a.key < b.key) { return -1; }
    if (a.key > b.key) { return 1; }
    return 0;
  });
  const resArr = _.uniqBy(diffArr, 'val');
  const propsStr = resArr.reduce((acc, item) => `${acc}\n${item.prefix}${item.key}: ${item.val}`, '');
  const res = `{${propsStr}\n}\n`;

  return res;
};
