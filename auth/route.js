const express = require('express')
const router = express.Router()
const passport = require('passport')
require('../config/passport')(passport);
const validator = require('../validator/validator');
const requireAuth = passport.authenticate('jwt', { session: false });
const {login, signUp,getAuthUser} = require('./controller')
const {userValidationRules, validate} = require('./userValidator')


router.post('/login', login)
// router.post('/signup',  userValidationRules(), validate,signUp)
router.post('/signup', signUp);
router.get('/getAuthUser', requireAuth, getAuthUser);

module.exports = router;