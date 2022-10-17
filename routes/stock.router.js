const express = require('express')
const stockController = require('../controllers/stock.controller')

const stockRouter = express.Router()
stockRouter.post('/stock/create', stockController.createProduitStock)
stockRouter.get('/', stockController.getAllProduit)
stockRouter.get('/categorie', stockController.getAllCategorie)
stockRouter.get('/sous_categorie/:id_categorie', stockController.getAllSousCategorie)
stockRouter.get('/couleur', stockController.getAllCouleur)
stockRouter.get('/taille', stockController.getAllTaille)

module.exports = stockRouter