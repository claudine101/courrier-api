const express = require("express")
const commandeController = require("../controllers/commande.controller")

const commandeRouter = express.Router()

commandeRouter.post('/clients', commandeController.createAllCommandes)
commandeRouter.get('/', commandeController.getCommandes)
commandeRouter.get('/:ID_COMMANDE', commandeController.findOneCommande)
commandeRouter.get('/status', commandeController.getStatus)
commandeRouter.get('/status/:ID_COMMANDE', commandeController.getCommandeStatus)
// commandeRouter.get('/partenaire', commandeController.commandePartenaire)

module.exports = commandeRouter