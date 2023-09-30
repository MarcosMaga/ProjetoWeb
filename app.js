const app = require('./config/server');
const fs = require('fs');
const path = require('path');

fs.readdirSync('./app/routes').forEach(file => {
    if(path.extname(file) === '.js'){
        const routeFile = require(path.join(__dirname, './app/routes', file));

        if(typeof routeFile === 'object' && routeFile !== null){
            for(const key in routeFile){
                if(typeof routeFile[key] === 'function')
                    routeFile[key](app); 
            }
        }
    }
})

