const inboxController = require('../controllers/inbox');
const notificationController = require('../controllers/notification');

module.exports = {
    socket: (app) => {
        app.io.on('connection', (socket) => {
            inboxController.notViewed(socket);
            notificationController.notViewed(socket);
        })
    }
}