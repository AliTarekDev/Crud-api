const { signUp, Login } = require('./user.auth');

const router= require('express').Router();


router.route('/signup').post(signUp);
router.route('/login').post(Login);

module.exports= router