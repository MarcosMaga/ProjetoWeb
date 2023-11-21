const likesModel = require('../models/like');
const notificationsModel = require('../models/notification');
const logger = require('../../config/logger');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const action = (req, res) => {
    const id = req.params.id;

    likesModel.getLikeById(`${req.session.user.id}-${id}`)
        .then((like) => {
            if(like){
                likesModel.deleteLike(`${req.session.user.id}-${id}`)
                    .then(() => {
                        res.status(200).send({likeStatus: false});
                    }).catch((error) => {
                        logger.error(`Erro ao deletar like de ID ${id}`);
                        res.status(400).send(error);
                    }).finally(async () => {
                        await prisma.$disconnect();
                    })
            } else{
                const data = {userId: parseInt(req.session.user.id), postId: parseInt(id)};
                
                likesModel.insertLike(data)
                    .then(() => {
                        const notification = {
                            fromId: req.session.user.id,
                            link: `/view/post/${data.postId}`,
                            type: 'like',
                            postId: data.postId
                        };
                        notificationsModel.insertPostNotification(notification)
                            .finally(async () => {
                                await prisma.$disconnect();
                            })
                        res.status(200).send({likeStatus: true});
                    }).catch((error) => {
                        logger.error(`Erro ao inserir like de ID ${id}`);
                        res.status(400).send(error);
                    }).finally(async () => {
                        await prisma.$disconnect();
                    })
            }
        }).catch((error) => {
            logger.error(`Erro ao achar like do usuário -> ${id} <- no Post`);
            res.status(400).send(error);
        }).finally(async () => {
            await prisma.$disconnect();
        })
}

module.exports = {action}