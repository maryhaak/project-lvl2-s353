import * as fs from 'fs';
import * as path from 'path';
import has from 'lodash/has';

const buildResStr = (arr) => {
  const propsStr = arr.reduce((acc, item) => `${acc}\n\t${item.state}${item.key}: ${item.val}`, '');
  return `{${propsStr}\n}`;
};


const parse = (beforeObj, afterObj) => {
  const diffArr = [];
  Object.keys(beforeObj).forEach(function(key){
    const beforeLineObj = { 'key': key, 'val': beforeObj[key] };
    if (has(afterObj, key)) {
      if (afterObj[key] === beforeObj[key]) {
        beforeLineObj.state = '  ';
      } else {
        const afterLineObj = { 'key': key, 'val': afterObj[key] };
        afterLineObj.state = '+ ';
        diffArr.push(afterLineObj);
        beforeLineObj.state = '- ';
      }
    } else {
      beforeLineObj.state = '- ';
    }
    diffArr.push(beforeLineObj);
  });
  
  Object.keys(afterObj).forEach(function(key){
    if (!has(beforeObj, key)) {
      const afterLineObj = { 'key': key, 'val': afterObj[key] };
      afterLineObj.state = '+ ';
      diffArr.push(afterLineObj);
    }
  });
  return diffArr;
}


const readFile = (path) =>
  fs.readFileSync(path, 'utf8', function (err, data) {
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

export default (firstConfig, secondConfig) => {
  const beforeData = readFile(path.resolve(__dirname, firstConfig));
  const afterData = readFile(path.resolve(__dirname, secondConfig));
  const beforeObj = JSON.parse(beforeData);
  const afterObj = JSON.parse(afterData);

  const diffArr = parse(beforeObj, afterObj);
  const res = buildResStr(diffArr);
  console.log(res);
  return res;
};
