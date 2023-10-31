const inboxController = require('../controllers/inbox');
const userLogger = require('../middlewares/logged');

module.exports = {
    inbox: (app) => {
        app.get('/inbox', userLogger, (req, res) => {
            inboxController.inbox(req, res);
        })
    }
}