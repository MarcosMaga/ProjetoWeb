const commentsController = require('../controllers/comment');
const userLogger = require('../middlewares/logged')

module.exports = {
    comment: (app) => {
        app.post('/comment', userLogger, (req, res) => {
            commentsController.action(req, res);
        })
        app.get('/comment/:id', userLogger, (req, res) => {
            commentsController.action(req, res);
        })
    }
}