const express = require('express')
const menucontroller = require('../controllers/restaurant.menu.controller')
const menuRouter = express.Router()
menuRouter.post('/create', menucontroller.createMenu)
menuRouter.get('/repas', menucontroller.getRepas)
menuRouter.get('/categories', menucontroller.getCategories)
menuRouter.get('/souscategories', menucontroller.getSousCategories)
menuRouter.get('/soussouscategories', menucontroller.getSousSousCategories)
menuRouter.get('/unites', menucontroller.getUnites)

module.exports = menuRouter