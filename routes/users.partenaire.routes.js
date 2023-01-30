const express = require('express')
const userPartenairecontroller = require('../controllers/user.partenaire.controller')
const userPartenaireRouter = express.Router()
userPartenaireRouter.post('/login', userPartenairecontroller.login)
userPartenaireRouter.post('/', userPartenairecontroller.createUser)
userPartenaireRouter.post('/Ajouter',userPartenairecontroller.createPartenaire)
userPartenaireRouter.put('/modifier/:ID_PARTENAIRE_SERVICE',userPartenairecontroller.UpdatePartenaire)
userPartenaireRouter.get('/categories/:ID_PARTENAIRE', userPartenairecontroller.getcategories)
userPartenaireRouter.get('/ecommerce', userPartenairecontroller.getAllPartenaire)
userPartenaireRouter.get('/ecommerce/one/:ID_PARTENAIRE_SERVICE', userPartenairecontroller.getOnePartenaire)

// userPartenaireRouter.get('/ecommerces', userPartenairecontroller.getAllPartenaires)
userPartenaireRouter.get('/ecommerce/:id', userPartenairecontroller.findByIdPartenaire)
userPartenaireRouter.get('/', userPartenairecontroller.findAll)
userPartenaireRouter.get('/shop', userPartenairecontroller.findAllShop)
userPartenaireRouter.put('/Updateshop/:ID_PARTENAIRE_SERVICE', userPartenairecontroller.UpdateShop)

userPartenaireRouter.get('/Resto', userPartenairecontroller.findAllResto)
userPartenaireRouter.get('/produits/:id', userPartenairecontroller.getProduits) 

userPartenaireRouter.get('/service/personne/:ID_SERVICE_CATEGORIE', userPartenairecontroller.getServicePersonne) 
module.exports = userPartenaireRouter