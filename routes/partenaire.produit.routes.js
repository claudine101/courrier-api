const express = require('express')
const produitcontroller = require('../controllers/produit.controller')
const produitRouter = express.Router()
produitRouter.post('/create', produitcontroller.createProduit)
produitRouter.get('/:id', produitcontroller.findByIdPartenaire)

module.exports = produitRouter