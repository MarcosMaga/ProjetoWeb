const userLogger = require('../middlewares/logged');
const searchController = require('../controllers/search');

module.exports = {
    search: (app) => {
        app.get('/search', userLogger, (req, res) => {
            searchController.search(req, res);
        })
    }
}