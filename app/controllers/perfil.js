const usersModel = require('../models/users');
const logger = require('../../config/logger');
const sharp = require('sharp');
const helpers = require('../helpers/baseurl');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const perfil = (req, res) => {
    usersModel.getUserByUsername(req.params.id)
        .then((user) => {
            if(user){
                res.render('perfil/perfil.ejs', {user: req.session.user, perfil: user});
            }else{
                res.render('errors/404.ejs', {error: "Perfil não encontrado :/"});
            }
        }).catch((error) => {
            logger.error(`Erro ao achar usuário com username: @${req.body.username}. Código do erro: ${error.code}`);
        }).finally(async () => {
            await prisma.$disconnect();
        });
}

const config = (req, res, validatorError) => {
    if(req.method == 'GET'){
        res.render('perfil/config.ejs', {user: req.session.user, error: null});
    }
    else if(req.method == 'POST'){
        if(!validatorError.isEmpty())
            res.render('perfil/config.ejs', {user: req.session.user, error: validatorError.array()})
        else{
            usersModel.updateUser(req.session.user.id, req.body)
            .then((user) => {
                req.session.user = user;
                res.redirect(`/perfil/${user.username}`);
            }).catch((error) => {
                if(error.code == 'P2002')
                    res.render('perfil/config.ejs', {user: req.session.user, error: [{msg: `O username "@${req.body.username}" já está em uso`}]})
                else
                    logger.error(`Erro ao atualizar usuário com username: @${req.body.username}. Código do erro: ${error.code}`);
                
            }).finally(async () => {
                await prisma.$disconnect();
            });
        }
    }
}

const picture = async (req, res) => {
    if(!req.file)
        res.render('errors/404.ejs', {error: "O servidor não encontrou nenhuma foto encaminhada :/"})
    else{
        const image = req.file.buffer;
        const timestamp = new Date().getTime();
        const path = __dirname + '/../../public/uploads/img/perfil/' + timestamp + req.file.originalname;
        console.log(path);

        sharp(image)
            .resize(640,640)
            .toFile(path, (err, info) => {
                if(err)
                    res.render('errors/404.ejs', {error: 'Oops... tivemos um probleminha :/'});
                else{
                    const data = {picture: '/uploads/img/perfil/' + timestamp + req.file.originalname};
                    usersModel.updateUser(req.session.user.id, data)
                        .then((user) => {
                            req.session.user = user;
                            res.redirect(`/perfil/${user.username}`);
                        }).catch((error) => {
                            logger.error(`Erro ao atualizar foto do usuário com username: @${req.body.username}. Código do erro: ${error.code}`);
                            res.redirect('/config/perfil');
                        }).finally(async () => {
                            await prisma.$disconnect();
                        })
                }
            })
    }
}

module.exports = {perfil, config, picture};