module.exports = {
    login: (app) => {
        app.get('/login', (req, res) => {
            res.send('teste');
        })
    }
}