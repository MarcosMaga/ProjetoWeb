const express = require('express');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', './app/views');
app.use(express.static(__dirname + '/../public'));

const helpersDirectory = path.join(__dirname, '/../app/helpers');
const helperFiles = fs.readdirSync(helpersDirectory);

const helpers = {};

fs.readdirSync(__dirname + '/../app/helpers').forEach(file => {
  if (path.extname(file) === '.js') {
    const helperFile = require(path.join(__dirname, '/../app/helpers', file));

    if (typeof helperFile === 'object' && helperFile !== null) {
      for (const key in helperFile) {
        if (typeof helperFile[key] === 'function') {
          helpers[key] = helperFile[key];
        }
      }
    }
  }
});

app.locals.helpers = helpers;


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(expressSession({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

app.listen(3000, () => {
    console.log("Servidor iniciado na porta 3000");
})

module.exports = app;