const sessionController = require('../controllers/session');

module.exports = {
    login: (app) => {
        app.get('/login', (req, res) => {
            sessionController.signin(req, res);
        })
    },
    signup: (app) => {
        app.get('/signup', (req, res) => {
            sessionController.signup(req, res);
        })
    }
}