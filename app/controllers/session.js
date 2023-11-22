const usersModel = require('../models/users');
const logger = require('../../config/logger');
const bcrypt = require('bcrypt');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const signin = (req, res) => {
    if(req.method === 'GET'){
        if(!req.session.user)
            res.render('session/login.ejs', {error: null});
        else
            res.redirect(`/perfil/${req.session.user.username}`);
    }
    else if(req.method === 'POST'){
        usersModel.getUserByEmail(req.body.email)
            .then((user) => {
                if(user){
                    bcrypt.compare(req.body.password, user.password, (err, result) => {
                        if(err){
                            res.redirect('/login');
                            logger.error(`Erro ao comparar senha de @${user.username}`)
                        }
                        if(result){
                            user.ip = req.ip;
                            usersModel.updateUser(user.id, user);
                            delete user.password;
                            req.session.user = user;

                            res.redirect(`/perfil/${user.username}`);
                        }else{
                            res.render('session/login.ejs', {error: "Senha ou email incorreto"});
                        }
                    })
                } else
                    res.render('session/login.ejs', {error: "Senha ou email incorreto"});
            }).catch((error) => {
                logger.error(`Erro ao achar usuário com email: ${req.body.email}.`);
            }).finally(async () => {
                await prisma.$disconnect();
            })
    }
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
                if(err){
                    res.redirect('/signup');
                    logger.error(`Erro ao transformar senha de ${req.email} em HASH. Código: ${err.code}`)
                }
                data.password = hash;

                usersModel.insertUser(data)
                .then((user) => {
                    res.redirect('/login')
                }).catch((error) => {
                    if(error.code === "P2002"){
                        const message = [{msg:`O email "${data.email}" ou o username "${data.username}" já estão em uso`}];
                        res.render('session/signup.ejs', {error: message, data: data});
                    }else{
                        logger.error(`Erro ao criar usuário ${data.email}. Código: ${error.code}`);
                        res.redirect('/signup');
                    }
                }).finally(async () => {
                    await prisma.$disconnect();
                })
            });
        }
    }
}

const logout = (req, res) => {
    req.session.destroy(err => {
        if(err)
            logger.error(`Erro ao deslogar usuário @${req.session.user.username}`);
        res.redirect('/login')
    })
}

module.exports = {signin, signup, logout};