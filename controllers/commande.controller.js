const commandeModel = require('../models/commande.model')
const Validation = require('../class/Validation')

const jwt = require("jsonwebtoken");
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const generateToken = require('../utils/generateToken');
const path = require("path");
const moment = require("moment");
const { query } = require('../utils/db');
const getReferenceCode = require('../utils/getReferenceCode');
const axios = require('axios').default
const paymentModel = require("../models/payment.model")

const createAllCommandes = async (req, res) => {
          try {
                    const getImageUri = (fileName) => {
                              if (!fileName) return null
                              if (fileName.indexOf("http") === 0) return fileName
                              return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
                    }
                    const { shipping_info, commandes, numero } = req.body
                    const validation = new Validation(
                              shipping_info,
                              {
                                        N0M: {
                                                  required: true,
                                                  length: [0, 255]
                                        },
                                        PRENOM: {
                                                  required: true,
                                                  length: [0, 255]
                                        },
                                        ADRESSE: {
                                                  required: true,
                                                  length: [0, 255]
                                        },
                                        TELEPHONE: {
                                                  required: true,
                                                  length: [8, 8]
                                        },
                                        AVENUE: {
                                                  length: [0, 255]
                                        },
                                        ID_COUNTRY: {
                                                  length: [0, 255]
                                        },
                              }, {
                              N0M: {
                                        required: "Nom est obligatoire",
                                        length: "Nom invalide"
                              },
                              PRENOM: {
                                        required: "Prénom est obligatoire",
                                        length: "Prénom est invalide"
                              },
                              ADRESSE: {
                                        required: "L'adresse est obligatoire",
                                        length: "Adresse est invalide"
                              },
                              TELEPHONE: {
                                        required: "Le numéro de téléphone est obligatoire",
                                        length: "Numéro de téléphone invalide"
                              },
                              AVENUE: {
                                        required: "Avenue est obligatoiree",
                                        length: "taille de l'avenue est invalide"
                              },
                              ID_COUNTRY: {
                                        required: "Le pays est obligatoiree",
                                        length: "taille de country est invalide"
                              },
                    }
                    )
                    if (!commandes || commandes.length == 0 || !Array.isArray(commandes)) {
                              validation.setError('commandes', "Veuillez préciser les commandes")
                    }
                    if (!numero) {
                              validation.setError('numero', "Le numéro ecocash est obligatoire")
                    }
                    let isnum = /^\d+$/.test(numero);
                    let isTel = /^\d+$/.test(shipping_info?.TELEPHONE);
                    if (!isnum || numero.length != 8) {
                              validation.setError('numero', "Numéro ecocash invalide")
                    }
                    if (!isTel) {
                              validation.setError('TELEPHONE', "Numéro de téléphone invalide")
                    }
                    if (commandes && Array.isArray(commandes)) {
                              commandes.forEach((commande, index) => {
                                        if (!commande.ID_PRODUIT_STOCK || !commande.QUANTITE || !commande.PRIX) {
                                                  validation.setError(`commandes_${index + 1}`, "Quelques informations de la commandes sont manquantes")
                                        }
                              })
                    }
                    if (commandes && Array.isArray(commandes)) {
                              await Promise.all(commandes.map(async commande => {
                                        const stock = (await query("SELECT QUANTITE_STOCKE, PRIX, eps.ID_PRODUIT_STOCK FROM ecommerce_produit_stock eps JOIN ecommerce_stock_prix esp ON esp.ID_PRODUIT_STOCK = eps.ID_PRODUIT_STOCK WHERE eps.ID_PRODUIT_STOCK=? AND esp.ID_STATUT = 1", [commande.ID_PRODUIT_STOCK]))[0]
                                        if (!stock || stock?.QUANTITE_STOCKE < commande?.QUANTITE) {
                                                  validation.setError(`ID_PRODUIT_STOCK_${commande.ID_PRODUIT_STOCK}`, 'Quantite insuffisante')
                                        }
                              }))
                    }
                    await validation.run()
                    const isValid = await validation.isValidate()
                    if (!isValid) {
                              const erros = await validation.getErrors()
                              return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                                        statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                                        httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                                        message: "Probleme de validation de donnees",
                                        result: erros
                              })
                    }
                    const CODE_UNIQUE = await getReferenceCode()
                    const DATE_LIVRAISON = null
                    // const econnetResponse = await axios.post('http://app.mediabox.bi/api_ussd_php/Api_client_ecocash', {
                    //                     VENDEUR_PHONE: "79839653",
                    //                     AMOUNT: "100",
                    //                     CLIENT_PHONE: numero,
                    //                     INSTANCE_TOKEN: "1"
                    // })
                    // const ecoData = econnetResponse.data()
                    // if (ecoData.statut == "200") {
                    // } else {
                    //           setLoading(false)
                    //           setErrors(ecoData.message || 'Erreur, réessayer plus tard')
                    // }
                    const { insertId } = await commandeModel.createCommandes(
                              req.userId,
                              DATE_LIVRAISON,
                              CODE_UNIQUE
                    )
                    const ecommerce_commande_details = []
                    var TOTAL = 0
                    commandes.forEach(commande => {
                              TOTAL += commande.QUANTITE * commande.PRIX
                              ecommerce_commande_details.push([
                                        insertId,
                                        commande.ID_PRODUIT_STOCK,
                                        commande.QUANTITE,
                                        commande.PRIX,
                                        commande.QUANTITE * commande.PRIX
                              ])
                    })
                    await commandeModel.createCommandeDetails(ecommerce_commande_details);
                    await commandeModel.createDetailLivraison(CODE_UNIQUE, shipping_info.N0M, shipping_info.PRENOM, shipping_info.ADRESSE, shipping_info.TELEPHONE, shipping_info.AVENUE, shipping_info.ID_COUNTRY)
                    await paymentModel.createOne(insertId, 1, numero, null, TOTAL, CODE_UNIQUE, 0)

                    const pureCommande = (await commandeModel.getOneCommande(insertId))[0]
                    const details = await commandeModel.getManyCommandesDetails([insertId])
                    var TOTAL_COMMANDE = 0
                    details.forEach(detail => TOTAL_COMMANDE += detail.QUANTITE * detail.PRIX)
                    const commande = {
                              ...pureCommande,
                              ITEMS: details.length,
                              TOTAL: TOTAL_COMMANDE,
                              details: details.map(detail => ({
                                        ...detail,
                                        IMAGE_1: getImageUri(detail.IMAGE_1)
                              }))
                    }

                    res.status(RESPONSE_CODES.OK).json({
                              statusCode: RESPONSE_CODES.OK,
                              httpStatus: RESPONSE_STATUS.OK,
                              message: "Enregistrement reussi avec succès",
                              result: commande
                    })
          }
          catch (error) {
                    console.log(error)
                    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                              statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                              httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                              message: "Erreur interne du serveur, réessayer plus tard"
                    })
          }
}

const getCommandes = async (req, res) => {
          try {
                    const getImageUri = (fileName) => {
                              if (!fileName) return null
                              if (fileName.indexOf("http") === 0) return fileName
                              return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
                    }
                    var commandesIds = []
                    const commandes = await commandeModel.getUserCommandes(req.userId)
                    commandes.forEach(commande => commandesIds.push(commande.ID_COMMANDE))
                    var details = 0
                    if(commandesIds.length > 0) {
                              details = await commandeModel.getManyCommandesDetails(commandesIds)
                    }
                    const commandesDetails = commandes.map(commande => {
                              var TOTAL_COMMANDE = 0
                              const myDetails = details.filter(d => d.ID_COMMANDE == commande.ID_COMMANDE)
                              myDetails.forEach(detail => TOTAL_COMMANDE += detail.QUANTITE * detail.PRIX)
                              return {
                                        ...commande,
                                        ITEMS: myDetails.length,
                                        TOTAL: TOTAL_COMMANDE,
                                        details: myDetails.map(detail => ({
                                                  ...detail,
                                                  IMAGE_1: getImageUri(detail.IMAGE_1)
                                        }))
                              }
                    })
                    res.status(RESPONSE_CODES.OK).json({
                              statusCode: RESPONSE_CODES.OK,
                              httpStatus: RESPONSE_STATUS.OK,
                              message: "succès",
                              result: commandesDetails
                    })
          }
          catch (error) {
                    console.log(error)
                    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                              statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                              httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                              message: "Erreur interne du serveur, réessayer plus tard",

                    })
          }
}

const getStatus = async (req, res) => {
          try {
                    const status = await query("SELECT * FROM ecommerce_commande_statut ORDER BY ID_STATUT")
                    res.status(RESPONSE_CODES.OK).json({
                              statusCode: RESPONSE_CODES.OK,
                              httpStatus: RESPONSE_STATUS.OK,
                              message: "Liste des status de commandes",
                              result: status
                    })
          } catch (error) {
                    console.log(error)
                    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                              statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                              httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                              message: "Erreur interne du serveur, réessayer plus tard",
                    })
          }
}

const getCommandeStatus = async (req, res) => {
          try {
                    const { ID_COMMANDE } = req.params
                    const status = await query("SELECT * FROM ecommerce_commande_statut ORDER BY ID_STATUT")
                    const commandesStatus = await query("SELECT * FROM ecommerce_commande_statut_historiques WHERE ID_COMMANDE = ? ORDER BY DATE_INSERTION ASC", [ID_COMMANDE])

                    const details = commandesStatus.map(history => {
                              const stt = status.find(hist => hist.ID_STATUT == history.ID_STATUT)
                              return {
                                        ...history,
                                        ...stt
                              }
                    })
                    const uncompletedStatus = status.filter(stt => details.filter(stt2 => stt.ID_STATUT == stt2.ID_STATUT).length == 0)
                    res.status(RESPONSE_CODES.OK).json({
                              statusCode: RESPONSE_CODES.OK,
                              httpStatus: RESPONSE_STATUS.OK,
                              message: "Historiques des status d'une commande",
                              result: [
                                        ...details.map(t => ({ ...t, completed: true })),
                                        ...uncompletedStatus.map(t => ({ ...t, completed: false }))
                              ]
                    })
          } catch (error) {
                    console.log(error)
                    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                              statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                              httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                              message: "Erreur interne du serveur, réessayer plus tard",
                    })
          }
}

module.exports = {
          createAllCommandes,
          getCommandes,
          createAllCommandes,
          getStatus,
          getCommandeStatus
}