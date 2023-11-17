const followController = require('../controllers/follow');
const userLogged = require('../middlewares/logged');

module.exports = {
    follow: (app) => {
        app.post('/follow', userLogged,(req, res) => {
            followController.action(req, res);
        })
        app.get('/follow/:id', userLogged, (req, res) => {
            followController.action(req, res);
        })
    }
}