const postsController = require('../controllers/post');
const userLogger = require('../middlewares/logged');

module.exports = {
    post: (app) => {
        app.post('/post', userLogger, (req, res) => {
            postsController.create(req, res);
        }),
        app.get('/post/news', userLogger, (req, res) => {
            postsController.news(req, res);
        })
    }
}