const express = require("express")
const commandeController = require("../controllers/commande.controller")

const commandeRouter = express.Router()
commandeRouter.get('/livraisons', commandeController.findAllLivraisons)
commandeRouter.post('/livraisons', commandeController.createAllLivraisons)
commandeRouter.post('/clients', commandeController.createAllCommandes)
commandeRouter.get('/clients', commandeController.findAllCommandes)

module.exports = commandeRouter