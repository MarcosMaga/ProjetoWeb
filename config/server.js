const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './app/views');
app.use(express.static(__dirname + '../public'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(3000, () => {
    console.log("Servidor iniciado na porta 3000");
})

module.exports = app;