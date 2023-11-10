const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const insertComment = async(data) => {
    return await prisma.comment.create({
        data,
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
            post: true
        },
        skip: (page - 1) * pageSize,
        take: pageSize
    })
}
module.exports = {insertComment, getCommentsByPost};