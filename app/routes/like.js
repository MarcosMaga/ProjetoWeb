const likesController = require('../controllers/like')
const userLogger = require('../middlewares/logged');

module.exports = {
    like: (app) => {
        app.get('/like/:id', userLogger, (req, res) => {
            likesController.action(req, res);
        })
    }
}