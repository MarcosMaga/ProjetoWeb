const userLogged = require('../middlewares/logged');
const searchController = require('../controllers/search');

module.exports = {
    search: (app) => {
        app.get('/search', userLogged, (req, res) => {
            searchController.search(req, res);
        })
    }
}