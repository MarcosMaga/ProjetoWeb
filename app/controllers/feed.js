const followModels = require('../models/follow');
const postsModels = require('../models/post');
const logger = require('../../config/logger')
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const action = (req, res) => {
    if(req.method === 'GET'){
        const page = req.query.page || 1;
        const pageSize = 10;

        followModels.getFollowingByUser(req.session.user.id)
            .then((followings) => {
                postsModels.getPostToFeedUser(req.session.user.id, (page - 1) * pageSize, pageSize)
                    .then((posts) => {
                        if(page == 1){
                            let user = req.session.user;
                            user.followings = followings;
                            res.render('feed/feed.ejs', {user: user, posts});
                        }else{
                            res.status(200).send({user: req.session.user, posts});
                        }
                    }).catch((error) => {
                        console.log(error);
                    }).finally(async () => {
                        await prisma.$disconnect();
                    })
            }).catch((error) => {
                logger.error(`Erro ao achar seguidores de @${req.session.user.username}`);
                console.log(error);
                res.status(400).send(error);
            }).finally(async () => {
                await prisma.$disconnect();
            })
    }
}

const other = (req, res) => {
    const page = req.query.page || 1;
    const pageSize = 5;

    postsModels.getOtherPost(req.session.user.id, (page - 1) * pageSize, pageSize)
        .then((posts) => {
            res.status(200).send({ user: req.session.user, posts });
        }).catch((error) => {
            console.log(error);
        }).finally(async () => {
            await prisma.$disconnect();
        })
}

module.exports = {action, other};