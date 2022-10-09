const express = require('express')
const partenairecontroller = require('../controllers/partenaire.controller')
const partenaireRouter = express.Router()
partenaireRouter.post('/create', partenairecontroller.createPartenaire)
partenaireRouter.get('/:id', partenairecontroller.findByService)
partenaireRouter.get('/', partenairecontroller.getAllPartenaireServices)
module.exports = partenaireRouter 