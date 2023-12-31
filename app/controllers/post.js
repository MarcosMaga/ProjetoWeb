const postsModel = require('../models/post');
const likesModel = require('../models/like');
const logger = require('../../config/logger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = (req, res) => {
    if(req.method == 'POST'){
        let data = req.body;
        data.creatorId = parseInt(req.session.user.id);
        data.receiverId = parseInt(data.receiverId);
        postsModel.insertPost(req.body)
            .then((post) => {
                res.redirect(req.get('Referer'));
            }).catch((error) => {
                logger.error(`Erro ao criar Post de  usuário ${data.creatorId} para usuário ${data.receiverId}. Código: ${error.code}`);
            }).finally(async () => {
                await prisma.$disconnect();
            })
    }else{
        postsModel.getPostById(parseInt(req.params.id))
            .then((posts) => {
                res.status(200).send(posts);
            }).catch((error) => {
                logger.error(`Erro ao achar Post ${req.params.id}. Código: ${error.code}`);
                res.status(400).send(error);
            }).finally(async () => {
                await prisma.$disconnect();
            })
    }
    
}

const view = (req, res) => {
    postsModel.getPostById(parseInt(req.params.id))
        .then((post) => {
            res.render('post/post.ejs', {post, user: req.session.user});
         }).catch((error) => {
            logger.error(`Erro ao achar Post ${req.params.id}. Código: ${error.code}`);
            res.status(400).send(error);
        }).finally(async () => {
            await prisma.$disconnect();
        })
}

const news = (req, res) => {
    postsModel.getPostsNotViwedByUser(req.session.user.id)
        .then((posts) => {
            if (posts.length > 0)
                res.status(200).send(posts);
        }).catch((error) => {
            logger.error(`Erro ao achar Post não vistos do usuário ${req.session.user.id}. Código: ${error.code}`);
            res.status(500).send(error);
        }).finally(async () => {
            await prisma.$disconnect();
        })
}

const del = (req, res) => {
    const { id } = req.params;

    postsModel.getPostById(parseInt(id))
        .then((post) => {
            if(post.creatorId == req.session.user.id || post.receiverId == req.session.user.id){
                    postsModel.deletePost(parseInt(id))
                        .then((posts) => {
                            res.redirect(req.get('Referer'));
                        }).catch((error) => {
                            console.log(error);
                            logger.error(`Erro ao deletar Post com o ID ${id}. Código: ${error.code}`);
                            res.status(500).send(error);
                        }).finally(async () => {
                            await prisma.$disconnect();
                        })
            }else{
                logger.info(`Usuário @${req.session.user.username} tentou violar acesso na rota 'post/delete'`);
                res.redirect('/logout');
            }
        }).catch((error) => {
            logger.error(`Erro ao encontrar Post com o ID ${id}`)
        }).finally(async () => {
            await prisma.$disconnect();
        })
}

const approved = (req, res) => {
    const id = parseInt(req.params.id);
    let data = req.body;
    data.approved = true;

    postsModel.getPostById(parseInt(id))
        .then((post) => {
            if(post.creatorId == req.session.user.id || post.receiverId == req.session.user.id){
                postsModel.updatePost(id, data)
                    .then((p) => {
                        res.redirect(req.get('Referer'));
                    }).catch((error) => {
                        logger.error(`Erro ao aprovar e atualizar o Post com ID ${post.id}`);
                    }).finally(async () => {
                        await prisma.$disconnect();
                    })
            }else{
                logger.info(`Usuário @${req.session.user.username} tentou violar acesso na rota 'post/update'`);
                res.redirect('/logout');
            }
        }).catch((error) => {
            logger.error(`Erro ao encontrar Post com o ID ${id}`)
        }).finally(async () => {
            await prisma.$disconnect();
        })
}

const liked = (req, res) => {
    const id = req.params.id;
    likesModel.getLikeById(`${req.session.user.id}-${id}`)
        .then((like) => {
            if(like)
                res.status(200).send({isLiked: true}).end();
            else
                res.status(200).send({isLiked: false}).end();
        }).catch((error) => {
            console.log(error);
        }).finally(async () => {
            await prisma.$disconnect();
        })
}

module.exports = { create, news, view, del, approved, liked };