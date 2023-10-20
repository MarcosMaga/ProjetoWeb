const perfilController = require('../controllers/perfil');
const { validationResult } = require('express-validator');
const { userBasicValidator } = require('../validators/user');
const helpers = require('../helpers/baseurl');
const userLogger = require('../middlewares/logged');
const upload = require('../../config/upload');

module.exports = {
    perfil: (app) => {
        app.get('/perfil/:id', (req, res) => {
            perfilController.perfil(req, res);
        })
        app.get('/config/perfil', userLogger, (req, res) => {
            perfilController.config(req, res, null);
        })
        app.post('/config/perfil', userLogger, userBasicValidator, (req, res) => {
            perfilController.config(req, res, validationResult(req));
        })
        app.post('/config/perfil/picture', upload.single('fileInput'), userLogger, (req, res) => {
            perfilController.picture(req, res);
        })
    }
}