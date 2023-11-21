const notificationsController = require('../controllers/notification');
const userLogged = require('../middlewares/logged');

module.exports = {
    notification: (app) => {
        app.get('/notification', userLogged, (req, res) => {
            notificationsController.notification(req, res);
        })
    }
}