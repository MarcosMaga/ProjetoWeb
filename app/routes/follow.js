const followController = require('../controllers/follow');
const userLogger = require('../middlewares/logged');

module.exports = {
    follow: (app) => {
        app.post('/follow', userLogger,(req, res) => {
            followController.action(req, res);
        })
        app.get('/follow/:id', userLogger, (req, res) => {
            followController.action(req, res);
        })
    }
}