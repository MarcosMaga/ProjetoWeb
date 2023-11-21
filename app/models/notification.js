const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const insertPostNotification = async(data) => {
    const toId = await prisma.post.findUnique({
        where: {
            id: data.postId
        }
    })

    delete data.postId;
    data.toId = toId.receiverId;

    if(data.toId != data.fromId){
        return await prisma.notification.create({
            data,
        })
    }
}

const insertNotification = async(data) => {
    if(data.toId != data.fromId){
        return await prisma.notification.create({
            data,
        })
    }
}

const updateNotification = async(id, data) => {
    return await prisma.notification.update({
        where: {
            id: id
        },
        data: data
    })
}

const deleteFollowNotification = async(data) => {
    const post = await prisma.notification.findFirst({
        where: {
            fromId: data.fromId,
            toId: data.toId,
            type: 'follow'
        }
    })

    return await prisma.notification.delete({
        where: {
            id: post.id
        }
    })
}

const getNotificationNotViewedByUser = async(id) => {
    return await prisma.notification.findMany({
        where: {
            toId: id,
            viewed: false
        }
    })
}

const getNotificationByUser = async(id, page, pageSize) => {
    return await prisma.notification.findMany({
        where: {
            toId: id
        },
        orderBy:{
            createdOn: 'desc'
        },
        include: {
            from: true
        },
        skip: (page - 1) * pageSize,
        take: pageSize
    })
}

module.exports = {insertPostNotification, insertNotification, updateNotification, deleteFollowNotification, getNotificationNotViewedByUser, getNotificationByUser};