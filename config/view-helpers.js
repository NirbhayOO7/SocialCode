const env = require('./environment');
const fs = require('fs');
const path = require('path');

module.exports = (app) =>{

    app.locals.assetPath = function(filePath){
        if(env.name == 'development'){
            filePath ='/'+filePath;
            return filePath;
        }

        return '/'+ JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[filePath];

        // here inplace of dot notation we have used square brackets notation to access object key value. 
    }
}