const commentsController = require('../controllers/comment');
const userLogged = require('../middlewares/logged')

module.exports = {
    comment: (app) => {
        app.post('/comment', userLogged, (req, res) => {
            commentsController.action(req, res);
        })
        app.get('/comment/:id', userLogged, (req, res) => {
            commentsController.action(req, res);
        })
        app.get('/comment/delete/:id', userLogged, (req, res) => {
            commentsController.del(req, res);
        })
    }
}