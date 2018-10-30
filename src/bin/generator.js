import * as fs from 'fs';

export default (firstConfig, secondConfig) => {
    const path = require("path");
    const beforeData = readFile(path.resolve(__dirname, firstConfig));
    const afterData = readFile(path.resolve(__dirname, secondConfig));
    return afterData;
};


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
