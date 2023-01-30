const express = require('express')
const servicecontroller = require('../controllers/service.controller')
const serviceRouter = express.Router()
serviceRouter.get('/', servicecontroller.findAllService)
// serviceRouter.put('/updateImage/:ID_PARTENAIRE_SERVICE', servicecontroller.UpdateImage)
serviceRouter.get('/search/:ID_SERVICE', servicecontroller.findOne)
serviceRouter.get('/partenaires/:ID_PARTENAIRE', servicecontroller.findPartenaireServices)
serviceRouter.post('/payement', servicecontroller.paye)
serviceRouter.get('/count/ecommerce/:ID_PARTENAIRE_SERVICE', servicecontroller.getEcommerceServiceCounts)
serviceRouter.get('/count/restaurant/:ID_PARTENAIRE_SERVICE', servicecontroller.getRestoServiceCounts)

module.exports = serviceRouter