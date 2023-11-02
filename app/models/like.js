const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const insertLike = async(data) => {
    return await prisma.like.create({
        data,
    });
}

const deleteLike = async(id) => {
    const [userId, postId] = id.split('-')
    return await prisma.like.delete({
        where: {
            userId_postId:{
                userId: parseInt(userId),
                postId: parseInt(postId)
            }
        }
    });
}

const getLikeById = async(id) => {
    const [userId, postId] = id.split('-')
    return await prisma.like.findUnique({
        where: {
            userId_postId:{
                userId: parseInt(userId),
                postId: parseInt(postId)
            }
        }
    });
}

module.exports = {insertLike, deleteLike, getLikeById}