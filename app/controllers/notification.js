const notificationsModel = require('../models/notification');
const logger = require('../../config/logger');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const notification = (req, res) => {
    const page = req.query.page || 1;
    const pageSize = 30;

    notificationsModel.getNotificationByUser(req.session.user.id, page, pageSize)
        .then((notifications) => {
            (async (notifications) => {
                const promises = notifications.map(async (notify) => {
                    await new Promise(async (resolve) => {
                        try{
                            let n = {...notify};
                            if(n.viewed == false){
                                n.viewed = true;
                                const id = n.id;
                                delete n.id;
                                delete n.from;
                                await notificationsModel.updateNotification(id, n);
                            }
                            resolve();
                        } catch(error){
                            console.log(error);
                            resolve();
                        }
                    })
                })

                await Promise.all(promises);
                res.render('notification/notification.ejs', {notifications: notifications, user: req.session.user});
            })(notifications);
        }).catch((error) => {
            logger.error(`Erro ao procurar notificações de @${req.session.user.username}`);
            res.status(400).send(error);
        }).finally(async () => {
            await prisma.$disconnect();
        })
}

const notViewed = (socket) => {
    const getNotification = () => {
        notificationsModel.getNotificationNotViewedByUser(socket.handshake.session.user.id)
                .then((notification) => {
                    socket.emit('notification', notification.length);
        })
    }

    if(socket.handshake.session.user){
        getNotification();
        setInterval(() => {
            getNotification();
        }, 2000);
    }
}

module.exports = {notification, notViewed};