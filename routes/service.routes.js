const express = require('express')
const servicecontroller = require('../controllers/service.controller')
const serviceRouter = express.Router()
serviceRouter.get('/', servicecontroller.findAllService)
serviceRouter.put('/updateImage/:ID_PARTENAIRE_SERVICE', servicecontroller.UpdateImage)
serviceRouter.get('/search/:ID_SERVICE', servicecontroller.findOne)
serviceRouter.get('/partenaire', servicecontroller.findService)
serviceRouter.post('/payement', servicecontroller.paye)


module.exports = serviceRouter


