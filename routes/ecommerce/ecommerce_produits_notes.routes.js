const express = require('express')
const ecommerce_produits_controller = require('../../controllers/ecommerce/ecommerce_produits.controller')

const ecommerce_produits_notes_routes = express.Router()

ecommerce_produits_notes_routes.post('/', ecommerce_produits_controller.createnotesProduit)
ecommerce_produits_notes_routes.get('/', ecommerce_produits_controller.getnotesProduit)
ecommerce_produits_notes_routes.get('/notes', ecommerce_produits_controller.getuserNotes)
module.exports =ecommerce_produits_notes_routes