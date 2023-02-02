const express = require('express')
const restaurant_commandes_routes = require('./restaurant_commandes.routes')
const ecommerce_produits_routes = require('./restaurant_menus.routes')
const restoRouter = express.Router()

restoRouter.use('/restaurant_menus', ecommerce_produits_routes)
restoRouter.use('/restaurant_commandes', restaurant_commandes_routes)

module.exports = restoRouter