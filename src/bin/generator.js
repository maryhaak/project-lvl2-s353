import * as fs from 'fs';
import * as path from 'path';
import has from 'lodash/has';

const buildResStr = (arr) => {
  const propsStr = arr.reduce((acc, item) => `${acc}\n\t${item.state}${item.key}: ${item.val}`, '');
  return `{${propsStr}\n}`;
};


const parse = (beforeObj, afterObj) => {
  const diffArr = [];
  const beforeKeysArr = Object.keys(beforeObj);
  const afterKeysArr = Object.keys(afterObj);
  for (let i = 0; i < beforeKeysArr.length; i += 1) {
    const key = beforeKeysArr[i];
    const beforeLineObj = { key, val: beforeObj[key] };
    if (has(afterObj, key)) {
      if (afterObj[key] === beforeObj[key]) {
        beforeLineObj.state = '  ';
      } else {
        const afterLineObj = { key, val: afterObj[key] };
        afterLineObj.state = '+ ';
        diffArr.push(afterLineObj);
        beforeLineObj.state = '- ';
      }
    } else {
      beforeLineObj.state = '- ';
    }
    diffArr.push(beforeLineObj);
  }
  for (let i = 0; i < afterKeysArr.length; i += 1) {
    const key = afterKeysArr[i];
    if (!has(beforeObj, key)) {
      const afterLineObj = { key, val: afterObj[key] };
      afterLineObj.state = '+ ';
      diffArr.push(afterLineObj);
    }
  }
  return diffArr;
};


const readFile = (config) => {
  const configPath = path.resolve(__dirname, config);
  return fs.readFileSync(configPath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error(err.message);
      } else {
        console.error(err);
      }
    } else {
      console.log(data);
    }
  });
};

export default (firstConfig, secondConfig) => {
  const beforeData = readFile(firstConfig);
  const afterData = readFile(secondConfig);
  const beforeObj = JSON.parse(beforeData);
  const afterObj = JSON.parse(afterData);

  const diffArr = parse(beforeObj, afterObj);
  const res = buildResStr(diffArr);
  console.log(res);
  return res;
};
