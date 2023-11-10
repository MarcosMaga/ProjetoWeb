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
    return await prisma.post.update({
        where: {
            id: id
        },
        data: data
    })
}

const deletePost = async(id) => {
    return await prisma.post.delete({
        where: {
            id: id
        }
    })
}

const getPostById = async(id) => {
    return await prisma.post.findUnique({
        where: {
            id: id
        },
        include: {
            likes: {
                include: {
                    user: true
                }
            }

        }
    })
}

const getPostApprovedByUser = async (id, page, pageSize) => {
    const posts = await prisma.post.findMany({
        where: {
            approved: true,
            receiverId: id
        },
        orderBy: {
            createdOn: 'desc'
        },
        include: {
            creator: true,
            receiver: true,
            likes: true,
            comments: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize
    });

    const postCount = await prisma.post.count({
        where: {
            receiverId: id,
            approved: true
        }
    });

    posts.count = postCount;

    return posts;
}




const getPostsNotApprovedByUser = async(id) => {
    return await prisma.post.findMany({
        where: {
            approved: false,
            receiverId: id
        },
        include: {
            creator: true
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

module.exports = {insertPost, updatePost, deletePost, getPostById,getPostApprovedByUser, getPostsNotApprovedByUser, getPostsNotViwedByUser};