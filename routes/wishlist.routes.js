const express = require('express')
const wishlistcontroller = require('../controllers/wishlist.controller')
const  wishlistRouter = express.Router()

wishlistRouter.post('/', wishlistcontroller.create)
wishlistRouter.get('/verification/:ID_PRODUIT_PARTENAIRE', wishlistcontroller.verfication)
wishlistRouter.delete('/suppression/:ID_PRODUIT_PARTENAIRE', wishlistcontroller.suppression)
module.exports = wishlistRouter