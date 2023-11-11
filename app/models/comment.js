const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const insertComment = async(data) => {
    return await prisma.comment.create({
        data,
    })
}

const deleteComment = async(id) => {
    return await prisma.comment.delete({
        where: {
            id: parseInt(id)
        }
    })
}

const getCommentById = async(id) => {
    return await prisma.comment.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            post: {
                select: {
                    receiverId: true
                }
            }
        }
    })
}

const getCommentsByPost = async(postId, page, pageSize) => {
    return await prisma.comment.findMany({
        where: {
            postId: postId
        },
        orderBy: {
            createdOn: 'desc'
        },
        include: {
            commentator: true,
            post: {
                select: {
                    receiverId: true
                }
            }
        },
        skip: (page - 1) * pageSize,
        take: pageSize
    })
}

module.exports = {insertComment, deleteComment, getCommentById, getCommentsByPost};