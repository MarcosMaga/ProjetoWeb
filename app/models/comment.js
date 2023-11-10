const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const insertComment = async(data) => {
    return await prisma.comment.create({
        data,
    })
}

module.exports = {insertComment};