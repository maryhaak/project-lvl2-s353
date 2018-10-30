import * as fs from 'fs';

export default (firstConfig, secondConfig) => {
    const path = require("path");
    const beforePath = path.resolve(__dirname, firstConfig);    

    const beforeData = fs.readFileSync(beforePath, 'utf8', function(err, data) {
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

    return beforeData;
};
