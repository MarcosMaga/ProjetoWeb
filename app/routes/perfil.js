const perfilController = require('../controllers/perfil');
const userLogger = require('../middlewares/logged');

module.exports = {
    perfil: (app) => {
        app.get('/perfil/:id', (req, res) => {
            perfilController.perfil(req, res);
        })
        app.get('/config/perfil', userLogger, (req, res) => {
            perfilController.config(req, res);
        })
    }
}