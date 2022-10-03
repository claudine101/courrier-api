const express = require('express')
const userPartenairecontroller = require('../controllers/user.partenaire.controller')
const userPartenaireRouter = express.Router()

userPartenaireRouter.post('/login', userPartenairecontroller.login)
userPartenaireRouter.post('/', userPartenairecontroller.createUser)
userPartenaireRouter.post('/Ajouter',userPartenairecontroller.createPartenaire)
userPartenaireRouter.get('/categories/:ID_PARTENAIRE', userPartenairecontroller.getcategories)
userPartenaireRouter.get('/ecommerce', userPartenairecontroller.getAllPartenaire)
userPartenaireRouter.get('/ecommerce/:id', userPartenairecontroller.findByIdPartenaire)
userPartenaireRouter.get('/produits/:id', userPartenairecontroller.getProduits)

module.exports = userPartenaireRouter