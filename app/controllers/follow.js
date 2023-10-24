const followsModel = require('../models/follow');
const logger = require('../../config/logger');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const action = (req, res) => {
    
    if(req.method == 'GET'){
        followsModel.getFollowById(req.params.id)
        .then((follow) => {
            if(follow)
                res.status(200).send({msg: 'Seguindo'});
            else
                res.status(200).send({msg: 'Seguir'});
        }).catch((error) => {
            logger.error(`Erro ao achar follow com o id: ${req.params.id}. Código: ${error.code}`);
        }).finally(async () => {
            await prisma.$disconnect();
        })
    }
    else if(req.method == 'POST'){
        const data = req.body;

        followsModel.getFollowById(`${data.followerId}-${data.followingId}`)
        .then((follow) => {
            if(follow){
                followsModel.deleteFollow(`${data.followerId}-${data.followingId}`)
                    .then((follow) => {
                        res.status(200).send({msg: 'Seguir'});
                    }).catch((error) => {
                        logger.error(`Erro ao deletar follow com o id: ${data.followerId}${data.followingId}. Código: ${error.code}`);
                        res.status(400).send({msg: 'Erro ao deixar seguir'});
                    }).finally(async () => {
                        await prisma.$disconnect();
                    })
            }else{
                followsModel.insertFollow(data)
                    .then((follow) => {
                        res.status(200).send({msg: 'Seguindo'});
                    }).catch((error) => {
                        console.log(error);
                        logger.error(`Erro ao criar follow com o id: ${data.followerId}${data.followingId}. Código: ${error.code}`);
                        res.status(400).send({msg: 'Erro ao seguir'});
                    }).finally(async () => {
                        await prisma.$disconnect();
                    })
                    
            }
        }).catch((error) => {
            logger.error(`Erro ao achar follow com o id: ${data.followerId}${data.followingId}. Código: ${error.code}`);
        }).finally(async () => {
            await prisma.$disconnect();
        })
    }
}

module.exports = {action};