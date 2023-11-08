const postsController = require('../controllers/post');
const userLogger = require('../middlewares/logged');

module.exports = {
    post: (app) => {
        app.post('/post', userLogger, (req, res) => {
            postsController.create(req, res);
        }),
        app.get('/post/:id', (req, res) => {
            postsController.create(req, res);
        })
        app.get('/post/delete/:id', userLogger, (req, res) => {
            postsController.del(req, res);
        }),
        app.get('/news/post', userLogger, (req, res) => {
            postsController.news(req, res);
        })
        app.post('/post/approved/:id', userLogger, (req, res) => {
            postsController.approved(req, res);
        })
        app.get('/post/liked/:id', userLogger,(req, res) => {
            postsController.liked(req, res);
        })
    }
}