const usersModel = require('../models/users');
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

        }).finally(async () => {
            await prisma.$disconnect();
        });
}

module.exports = {perfil};