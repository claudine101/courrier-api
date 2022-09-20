const express = require('express')
const approvisionnementcontroller = require('../controllers/approvisionnement.contraller')
const approvisionnementRouter = express.Router()
approvisionnementRouter.post('/create', approvisionnementcontroller.createApprovisionne)
module.exports = approvisionnementRouter