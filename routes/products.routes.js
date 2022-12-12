const express = require('express')
const productsController = require("../controllers/products.controller.js")
const productsRouter = express.Router()
productsRouter.get('/', productsController.getAllProducts)
productsRouter.put('/updateNom/:ID_PRODUIT', productsController.updateNom)
productsRouter.put('/updateDescription/:ID_PRODUIT_PARTENAIRE', productsController.updateDescription)
productsRouter.put('/updateApprovisionner/:ID_PRODUIT_PARTENAIRE', productsController.updateApprovisionner)
productsRouter.put('/updatePrice/:ID_PRODUIT_PARTENAIRE', productsController.updatePrice)

productsRouter.put('/:ID_PRODUIT/:index', productsController.updatePhoto)
productsRouter.get('/research', productsController.getProductResearch)
productsRouter.get('/details/', productsController.getDeatail)
productsRouter.get('/note/liste/:ID_PRODUIT_PARTENAIRE', productsController.getAllNotes)
productsRouter.post('/note', productsController.insertNote)
productsRouter.get('/note/:ID_PRODUIT_PARTENAIRE', productsController.getnotes)
productsRouter.get('/wishlist', productsController.getAllProduct)
productsRouter.get('/product/:ID_PRODUIT', productsController.getOne)
productsRouter.get('/products/:ID_PARTENAIRE_SERVICE', productsController.getbyID)
productsRouter.get('/categorie/:ID_PARTENAIRE_SERVICE', productsController.getCategorieByPartenaire)
productsRouter.get('/categories', productsController.getAllCategorie)
productsRouter.get('/sub_categories/:ID_CATEGORIE_PRODUIT', productsController.getSousCategoriesBy)
productsRouter.get('/sizes/:ID_CATEGORIE_PRODUIT/:ID_PRODUIT_SOUS_CATEGORIE', productsController.getSizes)
productsRouter.get('/size/:ID_PRODUIT_PARTENAIRE', productsController.getSize)
productsRouter.get('/color/:ID_PRODUIT_PARTENAIRE/:ID_TAILLE', productsController.getColor)
productsRouter.get('/all_sub_categories/', productsController.getAllSubCategories)
productsRouter.get('/colors', productsController.getAllColors)
productsRouter.get('/tailles', productsController.getAllSizes)
productsRouter.get('/couleurs', productsController.getAllColors)

module.exports = productsRouter