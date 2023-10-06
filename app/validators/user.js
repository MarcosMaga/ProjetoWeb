const {validationResult, check} = require('express-validator');

exports.userValidator = [
    check('email').isEmail().withMessage('Email inválido'),
    check('name').isLength({min: 6}).withMessage('Nome não possui pelo menos 6 caracteres'),
    check('username').isLength({min: 6}).withMessage('Username não possui pelo menos 6 caracteres'),
    check('password').isLength({min: 6}).withMessage('Senha não possui pelo menos 6 caracteres'),
    check('passwordC').custom((value, {req}) => {
        if(value !== req.body.password)
            throw new Error('As senhas não coincidem');
        return true;
    })
]