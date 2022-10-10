const express = require("express")
const commandeController = require("../controllers/commande.controller")

const commandeRouter = express.Router()

commandeRouter.post('/clients', commandeController.createAllCommandes)
commandeRouter.post('/clients/restaurant', commandeController.createRestoCommandes)
commandeRouter.get('/', commandeController.getCommandes)
<<<<<<< HEAD
commandeRouter.get('/:ID_COMMANDE', commandeController.findOneCommande)
commandeRouter.get('/status', commandeController.getStatus)
commandeRouter.get('/status/:ID_COMMANDE', commandeController.getCommandeStatus)
// commandeRouter.get('/parte', commandeController.commandePartenaire)
=======
commandeRouter.get('/restaurant', commandeController.getAllRestoCommandes)
commandeRouter.get('/:ID_COMMANDE', commandeController.findOneCommande)
commandeRouter.get('/status', commandeController.getStatus)
commandeRouter.get('/status/:ID_COMMANDE', commandeController.getCommandeStatus)
commandeRouter.get('/get/partenaire', commandeController.getPartenaireCommandes)
>>>>>>> e2f41e47caf0d65f1d1457a4136964a23131e406

module.exports = commandeRouter