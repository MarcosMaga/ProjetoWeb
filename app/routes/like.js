const likesController = require('../controllers/like')
const userLogged = require('../middlewares/logged');

module.exports = {
    like: (app) => {
        app.get('/like/:id', userLogged, (req, res) => {
            likesController.action(req, res);
        })
    }
}