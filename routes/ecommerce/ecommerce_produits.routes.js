const express = require('express')
const ecommerce_produits_controller = require('../../controllers/ecommerce/ecommerce_produits.controller')

const ecommerce_produits_routes = express.Router()
ecommerce_produits_routes.get('/', ecommerce_produits_controller.getAllProducts)
ecommerce_produits_routes.post('/', ecommerce_produits_controller.createProduit)

ecommerce_produits_routes.get('/ecommerce_produit_categorie', ecommerce_produits_controller.getCategories)
ecommerce_produits_routes.get('/ecommerce_produit_sous_categorie/:ID_CATEGORIE_PRODUIT', ecommerce_produits_controller.getSousCategories)
ecommerce_produits_routes.get('/ecommerce_produit_variants/:ID_PRODUIT', ecommerce_produits_controller.getProductVariants)

module.exports = ecommerce_produits_routes