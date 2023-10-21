const usersModel = require('../models/users');
const logger = require('../../config/logger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const search = (req, res) => {
    const value = req.query.value;
    if(!value)
        res.render('search/search.ejs', {users: null, user: req.session.user, value: null});
    else{
        usersModel.searchUser(value)
            .then((users) => {
                res.render('search/search.ejs', {users: users, user: req.session.user, value: value})
            })
            .catch((error) => {
                logger.error(`Falha ao encontrar usuários com a tag '${value}'. Código: ${error.code}`);
            })
            .finally(async () => {
                await prisma.$disconnect();
            })
    }
}

module.exports = {search};