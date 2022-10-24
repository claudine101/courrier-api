const express = require('express')
const partenaireProduitcontroller = require('../controllers/partenaire.produit.controller')
const partenaireProduitRouter = express.Router()
partenaireProduitRouter.post('/create', partenaireProduitcontroller.createProduit)
partenaireProduitRouter.get('/:id_partenaire_service', partenaireProduitcontroller.findByIdPartenaire)
partenaireProduitRouter.get('/stock/:id', partenaireProduitcontroller.findByIdProduit)

module.exports = partenaireProduitRouter