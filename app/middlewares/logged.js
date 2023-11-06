const userLogged = (req, res, next) =>{
    if(req.session.user)
        next();
    else
        res.status(403).redirect('/login');
}

module.exports = userLogged;