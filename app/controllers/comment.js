const commentsModel = require('../models/comment');
const notificationsModel = require('../models/notification');
const logger = require('../../config/logger');
const {PrismaClient} = require('@prisma/client');
const comment = require('../routes/comment');
const prisma = new PrismaClient();

const action = (req, res) => {
    if(req.method == 'POST'){
        let data = req.body;
        data.commentatorId = parseInt(req.session.user.id);
        data.postId = parseInt(data.postId);
        commentsModel.insertComment(data)
            .then((comment) => {
                const notification = {
                    fromId: req.session.user.id,
                    link: `/view/post/${data.postId}?search=comment_${comment.id}`,
                    type: 'comment',
                    postId: data.postId
                }
                notificationsModel.insertPostNotification(notification)
                    .finally(async () => {
                        await prisma.$disconnect();
                    })
                res.status(200).send(comment);
            }).catch((error) => {
                console.log(error);
                res.status(400).send(error);
            }).finally(async () => {
                await prisma.$disconnect();
            })
    }else{
        const page = req.query.page || 1;
        const pageSize = 10;

        commentsModel.getCommentsByPost(parseInt(req.params.id), page, pageSize)
            .then((comments) => {
                res.status(200).send({comments: comments, user: req.session.user});
            }).catch((error) => {
                console.log(error);
                res.status(400).send(error);
            }).finally(async () => {
                await prisma.$disconnect();
            })
    }
}

const del = (req, res) => {
    commentsModel.getCommentById(req.params.id)
        .then((comment) => {
            if(comment.commentatorId == req.session.user.id || comment.post.receiverId == req.session.user.id){
                commentsModel.deleteComment(req.params.id)
                    .then(() => {
                        res.redirect(req.get('Referer'));
                    }).catch((error) => {
                        logger.error(`Erro ao deletar comentário de ID ${comment.id}. Código: ${error.code}`)
                    }).finally(async () => {
                        await prisma.$disconnect();
                    })
            }else{
                logger.error(`Usuário @${req.session.user.username} tentou violar rota 'comment/delete'`);
                res.redirect('/logout');
            }
        }).catch((error) => {
            logger.error(`Erro ao achar comentário de ID ${req.params.id}. Código: ${error.code}`)
            res.status(400).send(error);
        }).finally(async () => {
            await prisma.$disconnect();
        })
}

module.exports = {action, del};