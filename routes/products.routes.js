const express = require('express')
const productsController = require("../controllers/products.controller.js")
const productsRouter = express.Router()
productsRouter.get('/', productsController.getAllProducts)
productsRouter.get('/note/liste/:ID_PRODUIT_PARTENAIRE', productsController.getAllNotes)
productsRouter.post('/note', productsController.insertNote)
productsRouter.get('/note/:ID_PRODUIT_PARTENAIRE', productsController.getnotes)
productsRouter.get('/wishlist', productsController.getAllProduct)

productsRouter.get('/product/:ID_PRODUIT', productsController.getOne)
productsRouter.get('/products/:ID_PARTENAIRE_SERVICE', productsController.getbyID)
productsRouter.get('/categories/:ID_PARTENAIRE_SERVICE', productsController.getCategorieByPartenaire)

productsRouter.get('/categories', productsController.getAllCategorie)
productsRouter.get('/sub_categories/:ID_CATEGORIE_PRODUIT', productsController.getSousCategoriesBy)
productsRouter.get('/sizes/:ID_CATEGORIE_PRODUIT/:ID_PRODUIT_SOUS_CATEGORIE', productsController.getSizes)
productsRouter.get('/size/:ID_PRODUIT_PARTENAIRE', productsController.getSize)
productsRouter.get('/color/:ID_PRODUIT_PARTENAIRE/:ID_TAILLE', productsController.getColor)

productsRouter.get('/all_sub_categories/', productsController.getAllSubCategories)
productsRouter.get('/colors', productsController.getAllColors)

module.exports = productsRouter