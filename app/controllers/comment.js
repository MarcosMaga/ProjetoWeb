const commentsModel = require('../models/comment');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const action = (req, res) => {
    if(req.method = 'POST'){
        let data = req.body;
        data.commentatorId = parseInt(req.session.user.id);
        data.postId = parseInt(data.postId);
        commentsModel.insertComment(data)
            .then((comment) => {
                res.status(200).send(comment);
            }).catch((error) => {
                console.log(error);
                res.status(400).send(error);
            }).finally(async () => {
                await prisma.$disconnect();
            })
    }
}

module.exports = {action};