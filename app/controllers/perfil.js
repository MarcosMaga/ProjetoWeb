const usersModel = require('../models/users');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const perfil = (req, res) => {
    usersModel.getUserByUsername(req.params.id)
        .then((user) => {

        }).catch((error) => {

        }).finally(async () => {
            await prisma.$disconnect();
        });
}

module.exports = {perfil};