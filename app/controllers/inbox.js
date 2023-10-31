const postsModel = require('../models/post');
const logger = require('../../config/logger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const inbox = (req, res) => {
    postsModel.getPostsNotApprovedByUser(req.session.user.id)
        .then((posts) => {
            (async (posts) => {
                const promises = posts.map(async (post) => {
                    await new Promise(async (resolve) => {
                        try{
                            let p = {...post}
                            p.viewed = true;
                            const id = p.id;
                            delete p.id;
                            delete p.creator;
                            await postsModel.updatePost(id, p);
                            resolve();
                        } catch(error){
                            logger.error(`Erro ao atualizar post do id ${id}. Código: ${error.code}`);
                            resolve();
                        }
                    });
                });
            
                await Promise.all(promises);
                res.render('inbox/inbox.ejs', {user: req.session.user, posts: posts});
            })(posts)
        })
        .catch((error) => {
            console.log(error);
            logger.error(`Falha ao achar posts não aprovados do usuário ${req.session.user.id}. Código: ${error.code}`);
            res.status(500).send(error);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}

module.exports = { inbox }