const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const insertUser = async(data) => {
    return await prisma.user.create({
        data,
    });
}

module.exports = {insertUser};