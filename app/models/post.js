const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const insertPost = async(data) => {
    return await prisma.post.create({
        data,
        select: {
            receiver: true
        }
    })
}

const getPostApprovedByUser = async(id) => {
    return await prisma.post.findMany({
        where: {
            approved: true,
            receiverId: id
        }
    })
}

module.exports = {insertPost, getPostApprovedByUser};