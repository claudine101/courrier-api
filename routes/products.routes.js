const express = require('express')
const productsController = require("../controllers/products.controller.js")


const productsRouter = express.Router()
productsRouter.get('/', productsController.getAllProducts)
productsRouter.get('/categories', productsController.getAllCategorie)
productsRouter.get('/sub_categories/:ID_CATEGORIE_PRODUIT', productsController.getAllSousCategories)
productsRouter.get('/sizes/:ID_CATEGORIE_PRODUIT', productsController.getSizes)
module.exports = productsRouter