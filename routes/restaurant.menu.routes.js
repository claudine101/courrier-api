const express = require('express')
const menucontroller = require('../controllers/restaurant.menu.controller')
const menuRouter = express.Router()
menuRouter.post('/create', menucontroller.createMenu)
menuRouter.get('/repas/:ID_TYPE_REPAS', menucontroller.getRepas)
menuRouter.get('/categories', menucontroller.getCategories)
menuRouter.get('/souscategories', menucontroller.getSousCategories)
menuRouter.get('/soussouscategories', menucontroller.getSousSousCategories)
menuRouter.get('/types', menucontroller.getTypesRepas)
menuRouter.get('/unites', menucontroller.getUnites)

module.exports = menuRouter