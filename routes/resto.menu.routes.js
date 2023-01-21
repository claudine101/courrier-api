const express = require("express")
const restoMenuController = require('../controllers/resto.menu.controller')

const restoMenuRouter = express.Router()
restoMenuRouter.get('/categories', restoMenuController.getAllCategories)
restoMenuRouter.get('/categories/:ID_PARTENAIRE_SERVICE', restoMenuController.getByIdCategories)
restoMenuRouter.get('/sous_categories/:ID_CATEGORIE_MENU', restoMenuController.getSousCategories)
restoMenuRouter.get('/note/liste/:ID_RESTAURANT_MENU', restoMenuController.getAllNotes)
restoMenuRouter.get('/note/:ID_RESTAURANT_MENU', restoMenuController.getnote)
restoMenuRouter.get('/:ID_PARTENAIRE_SERVICE', restoMenuController.getmenu)
restoMenuRouter.put('/update/:ID_RESTAURANT_MENU', restoMenuController.updateMenu)
restoMenuRouter.delete('/delete/:ID_RESTAURANT_MENU', restoMenuController.DeleteMenu)
restoMenuRouter.get('/restaurant/:ID_PARTENAIRE_SERVICE', restoMenuController.getByIdmenu)
//restoMenuRouter.get('/restaurants/:ID_PARTENAIRE_SERVICE', restoMenuController.getByIdPartenaire)
restoMenuRouter.get('/', restoMenuController.getAllmenu)
restoMenuRouter.get('/menu/research', restoMenuController.getmenuResearch)
restoMenuRouter.get('/', restoMenuController.getmenu)
restoMenuRouter.post('/note', restoMenuController.insertNote)
restoMenuRouter.get('/:ID_PARTENAIRE', restoMenuController.getmenubyIdPartenaire)
restoMenuRouter.get('/wishlist/all', restoMenuController.getWishlist)
restoMenuRouter.get('/wishlist', restoMenuController.getWishlist)
restoMenuRouter.put('/:ID_RESTAURANT_MENU', restoMenuController.upadtePhotoMenu)
restoMenuRouter.put('/description/:ID_RESTAURANT_MENU', restoMenuController.upadteAllDescription)

//nouveau route pour afficher les menus cote partenaire
restoMenuRouter.get('/resto/:ID_PARTENAIRE_SERVICE', restoMenuController.getAllMenuByPartenaire)
restoMenuRouter.get('/restaurant/count/:ID_PARTENAIRE_SERVICE', restoMenuController.getAllCountMenuByPartenaire)

//restoMenuRouter.get('/', restoMenuController.getmenu)
//restoMenuRouter.post('/note',restoMenuController.insertNote)

module.exports = restoMenuRouter
