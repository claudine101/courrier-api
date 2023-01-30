const express = require('express')
const partenairecontroller = require('../controllers/partenaire.controller')
const partenaireRouter = express.Router()
partenaireRouter.post('/create', partenairecontroller.createPartenaire)

partenaireRouter.get('/', partenairecontroller.getAllPartenaireServices)
partenaireRouter.get('/One/:ID_PARTENAIRE_SRVICE', partenairecontroller.getOneServices)
partenaireRouter.get('/resto', partenairecontroller.getAllPartenaire)


module.exports = partenaireRouter 
