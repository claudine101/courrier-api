const express = require('express')
const partenairecontroller = require('../controllers/partenaire.controller')
const partenaireRouter = express.Router()
partenaireRouter.post('/create', partenairecontroller.createPartenaire)
module.exports = partenaireRouter