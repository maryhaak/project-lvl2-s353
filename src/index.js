import * as commander from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import _ from 'lodash';
import has from 'lodash/has';


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


const parse = (beforeObj, afterObj) => {
  const beforeKeys = Object.keys(beforeObj);
  const afterKeys = Object.keys(afterObj);
  const beforeKeysObjArr = combineKeyObj(beforeKeys, beforeObj, afterObj, 'before');
  const afterKeysObjArr = combineKeyObj(afterKeys, beforeObj, afterObj, 'after');
  const diffArr = beforeKeysObjArr.concat(afterKeysObjArr);
  diffArr.sort((a, b) => {
    if (a.key < b.key) { return -1; }
    if (a.key > b.key) { return 1; }
    return 0;
  });
  const resArr = _.uniqBy(diffArr, 'val');

  const propsStr = resArr.reduce((acc, item) => `${acc}\n${item.prefix}${item.key}: ${item.val}`, '');
  return `{${propsStr}\n}\n`;
};


const readFile = (config) => {
  const configPath = path.isAbsolute(config) ? config : path.resolve(__dirname, config);
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


const generator = (firstConfig, secondConfig) => {
  const beforeData = readFile(firstConfig);
  const afterData = readFile(secondConfig);
  const beforeObj = JSON.parse(beforeData);
  const afterObj = JSON.parse(afterData);
  const res = parse(beforeObj, afterObj);
  console.log(res);
  return res;
};


export const initGendiff = () => {
  const program = new commander.Command();
  program
    .version('1.0.5')
    .usage('[options] <firstConfig> <secondConfig>')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'Output format')
    .action(generator);
  program.parse(process.argv);
};


export default generator;
