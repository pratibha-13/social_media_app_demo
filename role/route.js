const express = require('express')
const router = express.Router()

const {getRole, newRole, updateRole} = require('../role/controller')

router.get('/getRole', getRole)
router.post('/newRole', newRole)
router.post('/updateRole', updateRole)

module.exports = router;