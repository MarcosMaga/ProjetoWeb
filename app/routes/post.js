const postsController = require('../controllers/post');
const userLogged = require('../middlewares/logged');

module.exports = {
    post: (app) => {
        app.post('/post', userLogged, (req, res) => {
            postsController.create(req, res);
        })
        app.get('/post/:id', (req, res) => {
            postsController.create(req, res);
        })
        app.get('/view/post/:id', userLogged, (req, res) => {
            postsController.view(req, res);
        })
        app.get('/post/delete/:id', userLogged, (req, res) => {
            postsController.del(req, res);
        })
        app.get('/news/post', userLogged, (req, res) => {
            postsController.news(req, res);
        })
        app.post('/post/approved/:id', userLogged, (req, res) => {
            postsController.approved(req, res);
        })
        app.get('/post/liked/:id', userLogged,(req, res) => {
            postsController.liked(req, res);
        })
    }
}