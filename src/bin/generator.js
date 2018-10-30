import * as fs from 'fs';

export default (firstConfig, secondConfig) => {
    const path = require("path");
    const beforeData = readFile(path.resolve(__dirname, firstConfig));
    const afterData = readFile(path.resolve(__dirname, secondConfig));
    const beforeObj = JSON.parse(beforeData);
    const afterObj = JSON.parse(afterData);

    const diffArr = parse(beforeObj, afterObj);
    return buildResStr(diffArr);
};


const buildResStr = (arr) => {
    const propsStr = arr.reduce((acc, item) => acc + `\n\t${item.state}${item.key}: ${item.val}`, '');
    return `{${propsStr}\n}`;
};


const parse = (beforeObj, afterObj) => {
    const diffArr = [];
    Object.keys(beforeObj).map(function(key){
        const beforeLineObj = { 'key': key, 'val': beforeObj[key] };
        //то, что есть в первом: +, - или space
        if (typeof afterObj[key] !== 'undefined') {
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
    Object.keys(afterObj).map(function(key){
        if (typeof beforeObj[key] === 'undefined') {
            const afterLineObj = { 'key': key, 'val': afterObj[key] };
            afterLineObj.state = '+ ';
            diffArr.push(afterLineObj);
        }
    });
    return diffArr;
}


const readFile = (path) => {
    return fs.readFileSync(path, 'utf8', function(err, data) {
        if(err) {
            if(err.code == 'ENOENT') {
                console.error(err.message);
            } else {
                console.error(err);
            }
        } else {
            console.log(data);
        }
    });
}
