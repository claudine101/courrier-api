const express = require('express')
const servicecontroller = require('../controllers/service.controller')
const serviceRouter = express.Router()
serviceRouter.get('/', servicecontroller.findAllService)
module.exports = serviceRouter