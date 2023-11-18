const feedController = require('../controllers/feed');
const userLogged = require('../middlewares/logged');

module.exports = {
    feed: (app) => {
        app.get('/feed', userLogged, (req, res) => {
            feedController.action(req, res);
        })
    }
}