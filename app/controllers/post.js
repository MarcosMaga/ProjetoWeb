const postsModel = require('../models/post');
const logger = require('../../config/logger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = (req, res) => {
    let data = req.body;
    data.creatorId = parseInt(data.creatorId);
    data.receiverId = parseInt(data.receiverId);
    postsModel.insertPost(req.body)
        .then((post) => {
            res.redirect(`/perfil/${post.receiver.username}`);
        }).catch((error) => {
            logger.error(`Erro ao criar Post de  usuário ${data.creatorId} para usuário ${data.receiverId}. Código: ${error.code}`);
        }).finally(async () => {
            await prisma.$disconnect();
        })
}

const news = (req, res) => {
    postsModel.getPostsNotViwedByUser(req.session.user.id)
        .then((posts) => {
            if(posts.length > 0)
                res.status(200).send(posts);
        }).catch((error) => {
            logger.error(`Erro ao achar Post não vistos do usuário ${req.session.user.id}. Código: ${error.code}`);
            res.status(500).send(error);
        }).finally(async () => {
            await prisma.$disconnect();
        })
}

module.exports = {create, news};