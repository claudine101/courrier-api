const express = require('express')
const partenaireProduitcontroller = require('../controllers/')
const partenaireProduitRouter = express.Router()
partenaireProduitRouter.post('/create', partenaireProduitcontroller.createProduit)
partenaireProduitRouter.get('/:id', partenaireProduitcontroller.findByIdPartenaire)
partenaireProduitRouter.get('/stock/:id', partenaireProduitcontroller.findByIdProduit)

module.exports = partenaireProduitRouter