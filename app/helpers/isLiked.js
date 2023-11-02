const likesModel = require('../models/like');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    isLiked: (id) => {
        likesModel.getLikeById(id)
            .then((like) => {
                if(like)
                    return true;
                return false;
            }).catch((error) => {
                console.log(error);
            }).finally(async () => {
                await prisma.$disconnect();
            })
    }
}