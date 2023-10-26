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

const updatePost = async(id, data) => {
    return await prisma.post.updateMany({
        where: {
            id: id
        },
        data: data
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

const getPostsNotViwedByUser = async(id) => {
    return await prisma.post.findMany({
        where:{
            viewed: false,
            receiverId: id
        }
    })
}

module.exports = {insertPost, updatePost, getPostApprovedByUser, getPostsNotViwedByUser};