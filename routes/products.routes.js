const express = require('express')
const productsController = require("../controllers/products.controller.js")


const productsRouter = express.Router()
productsRouter.get('/', productsController.getAllProducts)
productsRouter.get('/:ID_PRODUIT_PARTENAIRE', productsController.getOne)
productsRouter.get('/categories/:ID_PARTENAIRE', productsController.getproducts)
productsRouter.get('/categories', productsController.getAllCategorie)
productsRouter.get('/sub_categories/:ID_CATEGORIE_PRODUIT', productsController.getSousCategoriesBy)
productsRouter.get('/sizes/:ID_CATEGORIE_PRODUIT', productsController.getSizes)
productsRouter.get('/all_sub_categories/', productsController.getAllSubCategories)
module.exports = productsRouter