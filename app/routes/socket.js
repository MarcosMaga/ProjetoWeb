const inboxController = require('../controllers/inbox');

module.exports = {
    socket: (app) => {
        app.io.on('connection', (socket) => {
            inboxController.notViewed(socket);
        })
    }
}