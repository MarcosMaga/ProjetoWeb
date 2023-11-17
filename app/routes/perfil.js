const perfilController = require('../controllers/perfil');
const { validationResult } = require('express-validator');
const { userBasicValidator } = require('../validators/user');
const userLogged = require('../middlewares/logged');
const upload = require('../../config/upload');

module.exports = {
    perfil: (app) => {
        app.get('/perfil/:id', (req, res) => {
            perfilController.perfil(req, res);
        })
        app.get('/config/perfil', userLogged, (req, res) => {
            perfilController.config(req, res, null);
        })
        app.get('/perfil/:id/posts', (req, res) => {
            perfilController.posts(req, res);
        })
        app.post('/config/perfil', userLogged, userBasicValidator, (req, res) => {
            perfilController.config(req, res, validationResult(req));
        })
        app.post('/config/perfil/picture', upload.single('fileInput'), userLogged, (req, res) => {
            perfilController.picture(req, res);
        })
    }
}