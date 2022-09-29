const express = require("express")
const restoMenuController = require('../controllers/resto.menu.controller')

const restoMenuRouter =express.Router()
restoMenuRouter.get('/categories', restoMenuController.getAllCategories)
restoMenuRouter.get('/sous_categories/:ID_CATEGORIE_MENU', restoMenuController.getSousCategories)
restoMenuRouter.get('/', restoMenuController.getmenu)
restoMenuRouter.get('/:ID_PARTENAIRE', restoMenuController.getmenubyIdPartenaire)
module.exports =restoMenuRouter
