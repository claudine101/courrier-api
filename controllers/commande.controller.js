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
        const { shipping_info, commandes, numero, service } = req.body
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

        var TOTAL = 0
        commandes.forEach(commande => {
            TOTAL += commande.QUANTITE * commande.PRIX
        })
        const econnetResponse = await axios.post('http://app.mediabox.bi/api_ussd_php/Api_client_ecocash', {
            VENDEUR_PHONE: "79839653",
            AMOUNT: TOTAL,
            CLIENT_PHONE: numero,
            INSTANCE_TOKEN: "2522"
        })
        const ecoData = econnetResponse.data
        if (false) {
            const { insertId } = await commandeModel.createCommandes(
                req.userId,
                DATE_LIVRAISON,
                CODE_UNIQUE,
                1
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
            await paymentModel.createOne(insertId, service, 1, numero, null, TOTAL, CODE_UNIQUE, 0)

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
        } else {
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: ecoData.message || 'Erreur inconnue, réessayer plus tard',
            })
        }
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
const getCommandes = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }
        // const service = (await query('SELECT ID_SERVICE FROM  partenaire_service WHERE ID_PARTENAIRE_SERVICE=?', [ID_PARTENAIRE_SERVICE]))[0]
            var commandesIds = []
            const commandes = await commandeModel.getUserCommandes(req.userId)
            commandes.forEach(commande => commandesIds.push(commande.ID_COMMANDE))
            var details = 0
            if (commandesIds.length > 0) {
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
        // }
        // else if (ID_SERVICE == 2) {
        //     var commandesIds = []
        //     const commandes = await commandeModel.getUserCommandesResto(req.userId, ID_SERVICE)
        //     commandes.forEach(commande => commandesIds.push(commande.ID_COMMANDE))
        //     var details = 0
        //     if (commandesIds.length > 0) {
        //         details = await commandeModel.getManyCommandesDetailsResto(commandesIds)
        //     }
        //     const commandesDetails = commandes.map(commande => {
        //         var TOTAL_COMMANDE = 0
        //         var PRIX = 0
        //         const myDetails = details.filter(d => d.ID_COMMANDE == commande.ID_COMMANDE)
                
        //         myDetails.forEach(detail => TOTAL_COMMANDE = detail.QUANTITE * detail.MONTANT)
        //         return {
        //             ...commande,
        //             ITEMS: myDetails.length,
        //             TOTAL: TOTAL_COMMANDE,
        //             details: myDetails.map(detail => ({
        //                 ...detail,
        //                 IMAGE_1: getImageUri(detail.IMAGE_1)
        //             }))
        //         }
        //     })
        //     res.status(RESPONSE_CODES.OK).json({
        //         statusCode: RESPONSE_CODES.OK,
        //         httpStatus: RESPONSE_STATUS.OK,
        //         message: "succès",
        //         result: commandesDetails
        //     })
        // }

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

const getPartenaireCommandes = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }
        const partenaire = (await query('SELECT ID_PARTENAIRE FROM partenaires WHERE ID_USER = ?', [req.userId]))[0]
        const commandesDetails = await commandeModel.getPartenaireCommandes(partenaire.ID_PARTENAIRE)

        const commandes = commandesDetails.map(cd => {
            var TOTAL_COMMANDE = 0
            const myDetails = commandesDetails.filter(d => d.ID_COMMANDE == cd.ID_COMMANDE)
            myDetails.forEach(detail => TOTAL_COMMANDE += detail.QUANTITE * detail.PRIX)
            const commande = {
                ID_STATUT: cd.ID_STATUT,
                ID_COMMANDE: cd.ID_COMMANDE,
                CODE_UNIQUE: cd.CODE_UNIQUE,
                DATE_COMMANDE: cd.DATE_COMMANDE,
                STATUT_DESCRIPTION: cd.STATUT_DESCRIPTION,
                NEXT_STATUS: cd.NEXT_STATUS
            }
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

        // partenaireproduits.forEach(partenaireproduit => PartenaireIds.push(partenaireproduit.ID_PRODUIT_STOCK))
        if (true) {
            res.status(RESPONSE_CODES.OK).json({
                statusCode: RESPONSE_CODES.OK,
                httpStatus: RESPONSE_STATUS.OK,
                message: "Liste des commandes du partenaire",
                result: commandes
            })
        }
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
const commandeDetail = async (req, res) => {
    try {
        //console.log(req.userId)
        const { limit, offset } = req.query
        const commande = await commandeModel.findDetail(req.userId, limit, offset)
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "succès",
            result: commande
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

//   const commandePartenaire = async (req, res) => {
//     try {
//               //console.log(req.userId)
//               const commande = await commandeModel.findcomande(req.userId)
//               res.status(RESPONSE_CODES.OK).json({
//                         statusCode: RESPONSE_CODES.OK,
//                         httpStatus: RESPONSE_STATUS.OK,
//                         message: "succès",
//                         result: commande
//               })
//     }
//     catch (error) {
//               console.log(error)
//               res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
//                         statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
//                         httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
//                         message: "Erreur interne du serveur, réessayer plus tard",

//               })
//     }
// }

const findOneCommande = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }
        const { ID_COMMANDE } = req.params
        const pureCommande = (await commandeModel.getOneCommande(ID_COMMANDE))[0]
        console.log()
        const details = await commandeModel.getManyCommandesDetails([ID_COMMANDE])
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
            message: "Une commande",
            result: commande
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

const commandePartenaire = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }
        var produitdIds = []
        const produits = await commandeModel.getPartenaireProduit(req.userId)
        produits.forEach(produit => produitdIds.push(produit.ID_PRODUIT_STOCK))
        console.log(produitdIds)
        var commandeDetails = 0
        if (produitdIds.length > 0) {
            commandeDetails = await commandeModel.getAllCommandesDetails(produitdIds)
        }
        console.log(commandeDetails)
        //   const commandesDetails = commandes.map(commande => {
        //             var TOTAL_COMMANDE = 0
        //             const myDetails = details.filter(d => d.ID_COMMANDE == commande.ID_COMMANDE)
        //             myDetails.forEach(detail => TOTAL_COMMANDE += detail.QUANTITE * detail.PRIX)
        //             return {
        //                       ...commande,
        //                       ITEMS: myDetails.length,
        //                       TOTAL: TOTAL_COMMANDE,
        //                       details: myDetails.map(detail => ({
        //                                 ...detail,
        //                                 IMAGE_1: getImageUri(detail.IMAGE_1)
        //                       }))
        //             }
        //   })
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "succès",
            result: produits
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

const createRestoCommandes = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/menu/${fileName}`
        }
        const { shipping_info, resto, numero, service } = req.body
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
        if (!resto || resto.length == 0 || !Array.isArray(resto)) {
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
        if (resto && Array.isArray(resto)) {
            resto.forEach((resto, index) => {
                if (!resto.ID_RESTAURANT_MENU || !resto.QUANTITE || !resto.MONTANT) {
                    validation.setError(`commandes_${index + 1}`, "Quelques informations de la commandes sont manquantes")
                }
            })
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

        const { insertId } = await commandeModel.createNewCommandes(
            req.userId,
            DATE_LIVRAISON,
            CODE_UNIQUE,
            1
        )
        const restaurant_commande_details = []
        var TOTAL = 0
        resto.forEach(restaurant => {
            TOTAL += restaurant.QUANTITE * restaurant.MONTANT
            restaurant_commande_details.push([
                insertId,
                restaurant.ID_RESTAURANT_MENU,
                restaurant.QUANTITE,
                restaurant.MONTANT,
                restaurant.QUANTITE * restaurant.MONTANT
            ])
        })
        await commandeModel.createCommandeRestoDetails(restaurant_commande_details);
        await commandeModel.createDetailLivraison(CODE_UNIQUE, shipping_info.N0M, shipping_info.PRENOM, shipping_info.ADRESSE, shipping_info.TELEPHONE, shipping_info.AVENUE, shipping_info.ID_COUNTRY)
        await paymentModel.createOne(insertId, service, 1, numero, null, TOTAL, CODE_UNIQUE, 0)

        const pureCommande = (await commandeModel.getOneRestoCommande(insertId))[0]
        const details = await commandeModel.getManyCommandesRestoDetails([insertId])
        var TOTAL_COMMANDE = 0
        details.forEach(detail => TOTAL_COMMANDE += detail.QUANTITE * detail.MONTANT)
        const commande = {
            ...pureCommande,
            ITEMS: details.length,
            TOTAL: TOTAL_COMMANDE,
            details: details.map(detail => ({
                ...detail,
                IMAGE_1: getImageUri(detail.IMAGE_1)
            }))
        }

        console.log(commande)

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
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}

const getAllRestoCommandes = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/menu/${fileName}`
        }
        var commandesIds = []
        const commandes = await commandeModel.getUserRestoCommandes(req.userId)
        console.log(commandes)
        commandes.forEach(commande => commandesIds.push(commande.ID_COMMANDE))
        console.log(commandesIds)
        var details = 0
        if (commandesIds.length > 0) {
            details = await commandeModel.getManyCommandesRestoDetails(commandesIds)
        }
        console.log(details)
        const commandesDetails = commandes.map(commande => {
            var TOTAL_COMMANDE = 0
            const myDetails = details.filter(d => d.ID_COMMANDE == commande.ID_COMMANDE)
            myDetails.forEach(detail => TOTAL_COMMANDE += detail.QUANTITE * detail.MONTANT)
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

const getStatusResto = async (req, res) => {
    try {
        const { ID_COMMANDE } = req.params
        const status = await query("SELECT * FROM restaurant_commande_statut ORDER BY ID_STATUT")
        const commandesStatus = await query("SELECT * FROM restaurant_commande_statut_historiques WHERE ID_COMMANDE = ? ORDER BY DATE_INSERTION ASC", [ID_COMMANDE])

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
// const findDetail = async (req, res) => {
//     try {
//         const getImageUri = (fileName) => {
//             if (!fileName) return null
//             if (fileName.indexOf("http") === 0) return fileName
//             return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
//         }
//         const { ID_COMMANDE } = req.params
//         const service = (await query('SELECT ID_SERVICE FROM commandes_payement WHERE ID_COMMANDE=?', [ID_COMMANDE]))[0]
//  if(service.ID_SERVICE==1)
//  {
//     const pureCommande = (await commandeModel.getOneCommande(ID_COMMANDE))[0]
//     console.log(pureCommande)
//     const details = await commandeModel.getCommandeDetails(ID_COMMANDE, req.userId)
//     var TOTAL_COMMANDE = 0
//     details.forEach(detail => TOTAL_COMMANDE += detail.QUANTITE * detail.PRIX)
//     const commande = {
//         ...pureCommande,
//         ITEMS: details.length,
//         TOTAL: TOTAL_COMMANDE,
//         details: details.map(detail => ({
//             ...detail,
//             IMAGE_1: getImageUri(detail.IMAGE_1)
//         }))
//     }
//     res.status(RESPONSE_CODES.OK).json({
//         statusCode: RESPONSE_CODES.OK,
//         httpStatus: RESPONSE_STATUS.OK,
//         message: "Une commande",
//         result: commande
//     })

//  }
//  else if(service.ID_SERVICE==2)
//  {
//     const pureCommande = (await commandeModel.getOneCommandeResto(ID_COMMANDE))[0]
//     console.log(pureCommande)
//     const details = await commandeModel.getCommandeDetailsRsto(ID_COMMANDE, req.userId)
//     var TOTAL_COMMANDE = 0
//     details.forEach(detail => TOTAL_COMMANDE += detail.QUANTITE * detail.PRIX)
//     const commande = {
//         ...pureCommande,
//         ITEMS: details.length,
//         TOTAL: TOTAL_COMMANDE,
//         details: details.map(detail => ({
//             ...detail,
//             IMAGE_1: getImageUri(detail.IMAGES_1)
//         }))
//     }
//     console.log(commande)
//     res.status(RESPONSE_CODES.OK).json({
//         statusCode: RESPONSE_CODES.OK,
//         httpStatus: RESPONSE_STATUS.OK,
//         message: "Une commande",
//         result: commande
//     })

//  }
       
//     } catch (error) {
//         console.log(error)
//         res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
//             statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
//             httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
//             message: "Erreur interne du serveur, réessayer plus tard",

//         })
//     }
// }

const getCountCommandes = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }
            const commandes = await commandeModel.getUserCountCommandes(req.userId)
            res.status(RESPONSE_CODES.OK).json({
                statusCode: RESPONSE_CODES.OK,
                httpStatus: RESPONSE_STATUS.OK,
                message: "succès",
                result: commandes
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
const findDetail = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }
        const {category, subCategory} = req.query
        const { ID_COMMANDE } = req.params
        const pureCommande = (await commandeModel.getOneCommande(ID_COMMANDE))[0]
        if(pureCommande){
            const detailLivraison = (await commandeModel.getLivraisons(pureCommande.CODE_UNIQUE))[0]
            const details = await commandeModel.getCommandeDetails(pureCommande.ID_COMMANDE, req.userId, category, subCategory)
            
            // const detailsProduits = (await commandeModel.getDetailsProduits(pureCommande.CODE_UNIQUE,category, subCategory, req.userId))[0]

            var TOTAL_COMMANDE = 0
            details.forEach(detail => TOTAL_COMMANDE += detail.QUANTITE * detail.PRIX)
            const commande = {
                ...pureCommande,
                ...detailLivraison, 
                ITEMS: details.length,
                TOTAL: TOTAL_COMMANDE,
                details: details.map(detail => ({
                    ...detail,
                    IMAGE_1: getImageUri(detail.IMAGE_1),
                    produit: {
                        ID_PRODUIT: detail.ID_PRODUIT,
                        NOM: detail.NOM,
                        ID_PRODUIT_PARTENAIRE: detail.ID_PRODUIT_PARTENAIRE,
                        IMAGE: getImageUri(detail.IMAGE_1),
                    },
                    partenaire: {
                        NOM_ORGANISATION: detail.NOM_ORGANISATION,
                        ID_PARTENAIRE: detail.ID_PARTENAIRE,
                        ID_TYPE_PARTENAIRE: detail.ID_TYPE_PARTENAIRE,
                        NOM: detail.NOM_USER,
                        PRENOM: detail.PRENOM
                    },
                    produit_partenaire: {
                        ID_PARTENAIRE_SERVICE: detail.ID_PARTENAIRE_SERVICE,
                        NOM_ORGANISATION: detail.NOM_ORGANISATION,
                        NOM: detail.NOM_PRODUIT_PARTENAIRE,
                        DESCRIPTION: detail.DESCRIPTION,
                        IMAGE_1: getImageUri(detail.IMAGE_1),
                        IMAGE_2: getImageUri(detail.IMAGE_2),
                        IMAGE_3: getImageUri(detail.IMAGE_3),
                        TAILLE: detail.NOM_TAILLE,
                        PRIX: detail.PRIX
                    },
                    categorie: {
                        ID_CATEGORIE_PRODUIT: detail.ID_CATEGORIE_PRODUIT,
                        NOM: detail.NOM_CATEGORIE
                    },
                    sous_categorie: {
                        ID_PRODUIT_SOUS_CATEGORIE: detail.ID_PRODUIT_SOUS_CATEGORIE,
                        NOM: detail.NOM_SOUS_CATEGORIE
                    },
                    stock: {
                        ID_PRODUIT_STOCK: detail.ID_PRODUIT_STOCK,
                        QUANTITE_STOCKE: detail.QUANTITE_TOTAL,
                        QUANTITE_RESTANTE: detail.QUANTITE_RESTANTE,
                        QUANTITE_VENDUE: detail.QUANTITE_VENDUS
                    }
                })), 
            }
            res.status(RESPONSE_CODES.OK).json({
                statusCode: RESPONSE_CODES.OK,
                httpStatus: RESPONSE_STATUS.OK,
                message: "Une commande",
                result: commande
            })
        }
       
    } catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",

        })
    }
}

const getCountCommandesByPartenaire = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }
        const {ID_PARTENAIRE_SERVICE} = req.params
            const commandes = await commandeModel.getUserCountByPartenaire(ID_PARTENAIRE_SERVICE)
            res.status(RESPONSE_CODES.OK).json({
                statusCode: RESPONSE_CODES.OK,
                httpStatus: RESPONSE_STATUS.OK,
                message: "succès",
                result: commandes
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

const getCommandesPartenaire = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }

            const {ID_PARTENAIRE_SERVICE} = req.params
            var commandesIds = []
            const commandes = await commandeModel.getUserCommandesPartenaire(ID_PARTENAIRE_SERVICE)
            commandes.forEach(commande => commandesIds.push(commande.ID_COMMANDE))
            var details = 0
            if (commandesIds.length > 0) {
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
module.exports = {
    createAllCommandes,
    getCommandes,
    createAllCommandes,
    getStatus,
    getCommandeStatus,
    findOneCommande,
    commandeDetail,
    commandePartenaire,
    createRestoCommandes,
    getAllRestoCommandes,
    getPartenaireCommandes,
    getStatusResto,
    findDetail,
    getCountCommandes,
    getCountCommandesByPartenaire,
    getCommandesPartenaire
}