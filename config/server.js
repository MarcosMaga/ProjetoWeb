const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const expressSession = require('express-session');
const sessionStore = new expressSession.MemoryStore();
const sharedSession = require('express-socket.io-session');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.io = io;
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

const sessionConfig = expressSession({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  store: sessionStore
});

app.use(sessionConfig);

app.io.use(sharedSession(sessionConfig, {
  autoSave: true
}));

server.listen(3000, '0.0.0.0', () => {
    console.log("Servidor iniciado na porta 3000");
})

module.exports = app;