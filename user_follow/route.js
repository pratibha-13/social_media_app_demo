const express = require('express')
const router = express.Router()
const passport = require('passport')
require('../config/passport')(passport);
const requireAuth = passport.authenticate('jwt', { session: false });
const {follow,followAction,followersList,followingList,requestedFollowList,myBlockList} = require('./controller')

router.post('/follow',requireAuth,follow)
router.post('/followAction',requireAuth,followAction)
router.post('/followersList',requireAuth,followersList)
router.post('/followingList',requireAuth,followingList)
router.post('/requestedFollowList',requireAuth,requestedFollowList)
router.post('/myBlockList',requireAuth,myBlockList)

module.exports = router;