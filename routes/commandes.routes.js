const express = require("express")
const commandeController = require("../controllers/commande.controller")

const commandeRouter = express.Router()

commandeRouter.post('/clients', commandeController.createAllCommandes)
commandeRouter.post('/clients/restaurant', commandeController.createRestoCommandes)
commandeRouter.get('/', commandeController.getCommandes)
commandeRouter.get('/partenaire/:ID_PARTENAIRE_SERVICE', commandeController.getCommandesPartenaire)

commandeRouter.get('/restaurant', commandeController.getAllRestoCommandes)
commandeRouter.get('/:ID_COMMANDE', commandeController.findOneCommande)
commandeRouter.get('/detail/:ID_COMMANDE', commandeController.findDetail)

commandeRouter.get('/status', commandeController.getStatus)
commandeRouter.get('/status/resto/:ID_COMMANDE', commandeController.getStatusResto)
commandeRouter.get('/status/:ID_COMMANDE', commandeController.getCommandeStatus)
commandeRouter.get('/get/partenaire', commandeController.getPartenaireCommandes)

commandeRouter.put('/status/update/:ID_COMMANDE', commandeController.getUpdateStatus)
commandeRouter.get('/ecommerce/livraison/:ID_COMMANDE', commandeController.getLivraisonDetails)

module.exports = commandeRouter