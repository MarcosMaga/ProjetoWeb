const signin = (req, res) => {
    if(req.method === 'GET')
        res.render('session/login.ejs');
}

const signup = (req, res) => {
    if(req.method === 'GET')
        res.render('session/signup.ejs');
}

module.exports = {signin, signup};