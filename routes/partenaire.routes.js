const express = require('express')
const partenairecontroller = require('../controllers/partenaire.controller')
const partenaireRouter = express.Router()
partenaireRouter.post('/create', partenairecontroller.createPartenaire)
// partenaireRouter.get('/:id', partenairecontroller.findByService)
partenaireRouter.get('/', partenairecontroller.getAllPartenaireServices)
partenaireRouter.get('/resto', partenairecontroller.getAllPartenaire)


module.exports = partenaireRouter 
