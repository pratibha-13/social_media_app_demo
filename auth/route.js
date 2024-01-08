const express = require('express')
const router = express.Router()
const passport = require('passport')
require('../config/passport')(passport);
const validator = require('../validator/validator');
const requireAuth = passport.authenticate('jwt', { session: false });
const {login, signUp,getAuthUser,editProfile,forgotPassword} = require('./controller')
const {userValidationRules, validate} = require('./userValidator')


router.post('/login', validator.login,login)
router.post('/signup', signUp);
router.get('/getAuthUser', requireAuth, getAuthUser);
router.post('/editProfile', editProfile);
router.post('/forgotPassword', validator.forgotPassword,forgotPassword);

module.exports = router;