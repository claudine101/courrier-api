const RESPONSE_CODES = require("../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../constants/RESPONSE_STATUS")
const { saveStatus,saveStatusResto } = require("../models/commande.model")

const paymentModel = require("../models/payment.model")
const { query } = require("../utils/db")

const confirmEconet = async (req, res) => {
          try  {
                   const { txni_d } = req.params
                   const payment = (await paymentModel.findBy('TXNI_D', txni_d))[0]
                   if(payment.ID_SERVICE==1 && payment.STATUT_ID == 0) {
                             const commande = (await query("SELECT ID_COMMANDE, ID_USER FROM ecommerce_commandes WHERE ID_COMMANDE = ? ", [payment.ID_COMMANDE]))[0]
                             await query("UPDATE ecommerce_commandes SET ID_STATUT = 2 WHERE ID_COMMANDE = ?", [payment.ID_COMMANDE])
                             await saveStatus(payment.ID_COMMANDE, req.userId, 2)
                             await paymentModel.changeStatus(txni_d, 1)
                             req.app.io.to(commande.ID_USER).emit("ECOCASH_CONFIRMED", { message: "Hello" })

                             // envoyer une notication au client pour le paiement
                    //          const clientsTokens = await notificationsModel.getClientsTokens(payment.CLIENT_ID_PAYEMENT)
                    //          const tokens = clientsTokens.map(token => token.TOKEN)
                    //          if(tokens.length > 0) {
                    //                    const message = `Vous venez de payer ${payment.MONTANT.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") } BIF avec succès pour une commande`
                    //                    sendPushNotifications(tokens, 'Paiement de la commade' , message, { command: commande, url: `wasilieats://Orders`, refreshOrders: true })
                    //          }
                             res.status(200).json({ confirmed: true, txni_d })
                   }
                   else if(payment.ID_SERVICE==2 && payment.STATUT_ID == 0) {

                        const commande = (await query("SELECT ID_COMMANDE, ID_USER FROM restaurant_commandes WHERE ID_COMMANDE = ? ", [payment.ID_COMMANDE]))[0]
                        await query("UPDATE restaurant_commandes SET ID_STATUT = 2 WHERE ID_COMMANDE = ?", [payment.ID_COMMANDE])
                        await saveStatusResto(payment.ID_COMMANDE, req.userId, 2)
                        await paymentModel.changeStatus(txni_d, 1)
                        req.app.io.to(commande.ID_USER).emit("ECOCASH_CONFIRMED", { message: "Hello" })

                        // envoyer une notication au client pour le paiement
               //          const clientsTokens = await notificationsModel.getClientsTokens(payment.CLIENT_ID_PAYEMENT)
               //          const tokens = clientsTokens.map(token => token.TOKEN)
               //          if(tokens.length > 0) {
               //                    const message = `Vous venez de payer ${payment.MONTANT.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") } BIF avec succès pour une commande`
               //                    sendPushNotifications(tokens, 'Paiement de la commade' , message, { command: commande, url: `wasilieats://Orders`, refreshOrders: true })
               //          }
                        res.status(200).json({ confirmed: true, txni_d })
              }
                    else {
                             res.status(404).json({ confirmed: false, 'error': "Impossible de trouver le paiement" })
                   }
         } catch (error) {
                    console.log(error)
                    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                              statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                              httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                              message: "Erreur interne du serveur, réessayer plus tard"
                    })
         }
}

module.exports = {
          confirmEconet
}