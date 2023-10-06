const userLogger = require('../middlewares/logged');

module.exports = {
    perfil: (app) => {
        app.get('/perfil', userLogger,(req, res) => {
            res.send(req.session.user);
        })
    }
}