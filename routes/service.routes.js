const express = require('express')
const servicecontroller = require('../controllers/service.controller')
const serviceRouter = express.Router()
serviceRouter.get('/', servicecontroller.findAllService)
serviceRouter.get('/search/:ID_SERVICE', servicecontroller.findOne)
serviceRouter.get('/partenaire', servicecontroller.findService)

module.exports = serviceRouter