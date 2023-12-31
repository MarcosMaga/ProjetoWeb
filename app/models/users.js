const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const insertUser = async(data) => {
    return await prisma.user.create({
        data,
    });
}

const updateUser = async(userId, data) => {
    return await prisma.user.update({
        where: { id: userId },
        data: data
    });
}

const getUserByEmail = async(email) => {
    return await prisma.user.findUnique({
        where:{
            email: email,
        },
    });
}

const getUserByUsername = async(username) => {
    return await prisma.user.findUnique({
        where:{
            username: username,
        },
        include:{
            followers: {
                include: {
                    follower: true
                }
            },
            followings: {
                include: {
                    following: true
                }
            }
        }
    });
}

const searchUser = async(query) => {
    return await prisma.user.findMany({
        where: {
            OR: [
                {
                    username: {
                        contains: query
                    }
                },
                {
                    name: {
                        contains: query
                    }
                }
            ]
        }
    })
}

module.exports = {insertUser, updateUser,getUserByEmail, getUserByUsername, searchUser};