const inboxController = require('../controllers/inbox');
const userLogged = require('../middlewares/logged');

module.exports = {
    inbox: (app) => {
        app.get('/inbox', userLogged, (req, res) => {
            inboxController.inbox(req, res);
        })
    }
}