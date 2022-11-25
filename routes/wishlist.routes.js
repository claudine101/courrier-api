const express = require('express')
const wishlistcontroller = require('../controllers/wishlist.controller')
const  wishlistRouter = express.Router()

wishlistRouter.post('/', wishlistcontroller.create)
wishlistRouter.post('/partenaire', wishlistcontroller.createNote)
wishlistRouter.get('/partenaire/:ID_PARTENAIRE_SRVICE', wishlistcontroller.listeNote)

wishlistRouter.get('/partenaire/verification/:ID_PARTENAIRE_SRVICE', wishlistcontroller.verfication_note_partenaire)
wishlistRouter.delete('/partenaire/suppression/:ID_PARTENAIRE_SRVICE', wishlistcontroller.suppression_note_partenaire)

wishlistRouter.get('/verification/:ID_PRODUIT_PARTENAIRE', wishlistcontroller.verfication)
wishlistRouter.delete('/suppression/:ID_PRODUIT_PARTENAIRE', wishlistcontroller.suppression)

wishlistRouter.post('/restaurant/', wishlistcontroller.createResto)
wishlistRouter.get('/restaurant/verification/:ID_RESTAURANT_MENU', wishlistcontroller.verficationResto)
wishlistRouter.delete('/restaurant/suppression/:ID_RESTAURANT_MENU', wishlistcontroller.suppressionResto)

module.exports = wishlistRouter