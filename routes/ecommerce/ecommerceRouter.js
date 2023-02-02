const express = require('express')
const ecommerce_commandes_routes = require('./ecommerce_commandes.routes')
const ecommerce_produits_routes = require('./ecommerce_produits.routes')
const ecommerceRouter = express.Router()

ecommerceRouter.use('/ecommerce_commandes', ecommerce_commandes_routes)
ecommerceRouter.use('/ecommerce_produits', ecommerce_produits_routes)

module.exports = ecommerceRouter