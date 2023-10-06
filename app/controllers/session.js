const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const signin = (req, res) => {
    if(req.method === 'GET')
        res.render('session/login.ejs');
}

const signup = (req, res, error) => {
    if(req.method === 'GET')
        res.render('session/signup.ejs', {error: null, data: null});
    else if(req.method === 'POST'){
        let data = req.body;
        delete data.passwordC;
        if(!error.isEmpty()){
            res.render('session/signup.ejs', {error: error.array(), data: data});
        }
        else{
            data.ip = req.ip;
            bcrypt.hash(data.password, 10, (err, hash) => {
                if(err)
                    res.status(500).send(err).end();
                data.password = hash;

                userModel.insertUser(data)
                .then((user) => {
                    res.redirect('/login')
                }).catch((error) => {
                    if(error.code === "P2002"){
                        const message = [{msg:`O email "${data.email}" ou o username "${data.username}" já estão em uso`}];
                        res.render('session/signup.ejs', {error: message, data: data});
                    }
                }).finally(async () => {
                    await prisma.$disconnect();
                })
            });
        }
    }
}

module.exports = {signin, signup};