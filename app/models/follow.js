const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const insertFollow = async(data) => {
    return await prisma.follow.create({
        data,
    });
}

const deleteFollow = async(id) => {
    const [followerId, followingId] = id.split('-').map(Number);
    return await prisma.follow.delete({
        where: {
            followerId_followingId:{
                followerId: followerId,
                followingId: followingId
            }
        }
    });
}

const getFollowingByUser = async(id) => {
    return await prisma.follow.findMany({
        where: {
            followerId: parseInt(id)
        },
        include: {
            following: true
        }
    })
}

const getFollowById = async(id) => {
    const [followerId, followingId] = id.split('-').map(Number);
    return await prisma.follow.findUnique({
        where: {
            followerId_followingId:{
                followerId: followerId,
                followingId: followingId
            }
        }
    });
}

module.exports = {insertFollow, deleteFollow, getFollowingByUser, getFollowById}