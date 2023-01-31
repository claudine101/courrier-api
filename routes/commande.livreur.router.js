const express = require('express')
const commandeLivreurController = require("../controllers/commande.livreur.controller")

const commandeLivreurRouter = express.Router()
commandeLivreurRouter.get('/ecommerce/:ID_PARTENAIRE_SERVICE', commandeLivreurController.getCommandeLivreur)
commandeLivreurRouter.get('/restaurant/:ID_PARTENAIRE_SERVICE', commandeLivreurController.getCommandeLivreurResto)

module.exports = commandeLivreurRouter