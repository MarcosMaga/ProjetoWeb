const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const insertUser = async(data) => {
    return await prisma.user.create({
        data,
    });
}

const getUserByEmail = async(email) => {
    return await prisma.user.findUnique({
        where:{
            email: email,
        },
    });;
}

module.exports = {insertUser, getUserByEmail};