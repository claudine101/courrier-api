const express = require("express")
const commandeController = require("../controllers/commande.controller")

const commandeRouter = express.Router()

commandeRouter.post('/clients', commandeController.createAllCommandes)
commandeRouter.get('/', commandeController.commandeDetail)
commandeRouter.get('/partenaire', commandeController.commandePartenaire)


module.exports = commandeRouter