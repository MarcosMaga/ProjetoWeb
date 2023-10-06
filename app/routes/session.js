const sessionController = require('../controllers/session');
const { validationResult } = require('express-validator');
const { userValidator } = require('../validators/user');

module.exports = {
    login: (app) => {
        app.get('/login', (req, res) => {
            sessionController.signin(req, res);
        })
        app.post('/login', (req, res) => {
            sessionController.signin(req, res);
        })
    },
    signup: (app) => {
        app.get('/signup', (req, res) => {
            sessionController.signup(req, res, null);
        })
        app.post('/signup', userValidator, (req, res) => {
            sessionController.signup(req, res, validationResult(req));
        })
    }
}