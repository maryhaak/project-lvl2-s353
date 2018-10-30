#!/usr/bin/env node
// import * as fs from 'fs';
import generator from './generator';

/*export const generator = (firstConfig, secondConfig) => {
    console.log('!generator');
    // console.log('firstConfig:');
    // console.log(firstConfig);
    // console.log('secondConfig:');
    // console.log(secondConfig);
    const path = require("path");
    // const resolvedPath = path.resolve(__dirname, '../../__tests__/__fixtures__/before.json');
    const resolvedPath = path.resolve(__dirname, firstConfig);
    console.log('resolvedPath:');
    console.log(resolvedPath);

    const beforeData = fs.readFileSync(resolvedPath, 'utf8', function(err, data) {
        if(err) {
            if(err.code == 'ENOENT') {
                //console.error(err.message);
            } else {
                console.error(err);
            }
        } else {
            console.log(data);
        }
    });

    console.log('beforeData:');
    console.log(beforeData);

    return beforeData;
};
*/
const initGendiff = () => {
    console.log('initGendiff');
    const program = require('commander');

    program
        .version('1.0.5')
        .usage('[options] <firstConfig> <secondConfig>')
        .description('Compares two configuration files and shows a difference.')
        .option('-f, --format [type]', 'Output format')
        .action(generator);

    program.parse(process.argv);
};

initGendiff();
