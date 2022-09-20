const commandeModel = require('../models/commande.model')
const Validation = require('../class/Validation')
const jwt = require("jsonwebtoken");
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const generateToken = require('../utils/generateToken');
const path = require("path");
const moment = require("moment");
const { query } = require('../utils/db');

const findAllLivraisons = async (req, res) => {
        try {
                const livraisons = await commandeModel.findAll()
                res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "Vous avez bien retourner les donnees",
                        result: livraisons
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

const findAllCommandes = async (req, res) => {
        try {
                const Allcommandes = await commandeModel.findCommandes(req.userId)
                res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "Vous avez bien retourner les donnees",
                        result: Allcommandes
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

const createAllLivraisons = async (req, res) => {
        try {
                const { NOM, PRENOM, ADRESSE, LONGITUDE, LATITUDE } = req.body
                const validation = new Validation(req.body,
                        {

                                NOM:
                                {
                                        required: true,
                                        length :[0,255]
                                },
                                PRENOM:
                                {
                                        required: true,
                                        length :[0,255]
                                },
                                ADRESSE:
                                {
                                        required: true,
                                        length :[0,255]
                                },

                                LONGITUDE:
                                {
                                        required: true,
                                        length :[0,255]
                                },
                                LATITUDE:
                                {
                                        required: true,
                                        length :[0,255]
                                },

                        },
                        {

                                NOM:
                                {
                                        required: "Le nom est obligatoire",
                                },
                                PRENOM: {
                                        required: "Le prenom est obligatoire",
                                },
                                ADRESSE: {
                                        required: "L'adresse est obligatoire",
                                },
                                LONGITUDE: {
                                        required: "Longitude est obligatoire",
                                },
                                LATITUDE: {
                                        required: "Laltitude est obligatoire",
                                }


                        }
                )
                await validation.run()
                const isValide = await validation.isValidate()
                const errors = await validation.getErrors()
                if (!isValide) {
                        return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                                message: "Probleme de validation des donnees",
                                result: errors
                        })

                }

                const { insertId } = await commandeModel.createLivraisons(
                        req.userId,
                        NOM,
                        PRENOM,
                        ADRESSE,
                        LONGITUDE,
                        LATITUDE,
                )

                const tous_livraisons = (await commandeModel.findAllLivraisonById(insertId)) [0]
                res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "enregistrement reussi avec Succès",
                        result: tous_livraisons
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

const createAllCommandes = async (req, res) => {
        try {
                const { ID_LIVRAISON, DATE_DEBUT_LIVRAISON, result } = req.body
                const validation = new Validation(req.body, {
                        ID_LIVRAISON: {
                                required: true,
                                exists: 'ecommerce_clients_livraison,ID_LIVRAISON'
                        }
                }, {
                        ID_LIVRAISON: {
                                required: 'Champs obligatoire'
                        }
                })
                
                await Promise.all(result.map(async element => {
                        const stock = (await query("SELECT QUANTITE_STOCKE FROM ecommerce_produit_stock WHERE ID_PRODUIT_STOCK=?",[element.ID_PRODUIT_STOCK]))[0]
                        if(stock.QUANTITE_STOCKE < element.QUANTITE){
                                await validation.setError(`ID_PRODUIT_STOCK_${element.ID_PRODUIT_STOCK}`, 'Quantite insuffisante')
                        }
                }))
                await validation.run()
                const isValid = await validation.isValidate()
                if(!isValid) {
                        const erros = await validation.getErrors()
                        return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                                message: "Probleme de validation de donnees",
                                result: erros
                        })
                }
                

                let PRIX_COMMANDE = 0
                let PRIX_LIVRAISON = 0
                let SOMME_TOTALE = 0

                result.forEach(detail => {
                        PRIX_COMMANDE += detail.PRIX * detail.QUANTITE
                })
                SOMME_TOTALE += PRIX_COMMANDE + PRIX_LIVRAISON

                const DATE_FIN_LIVRAISON = moment(DATE_DEBUT_LIVRAISON).add(5, 'hours').format('YYYY/MM/DD HH:mm:ss')

                const { insertId } = await commandeModel.createCommandes(
                        req.userId,
                        ID_LIVRAISON,
                        PRIX_COMMANDE,
                        PRIX_LIVRAISON,
                        SOMME_TOTALE,
                        0,
                        1,
                        DATE_DEBUT_LIVRAISON,
                        DATE_FIN_LIVRAISON
                )

                await Promise.all(result.map(async detail => {
                        const { insertId: id_details } = await commandeModel.createCommandeDetails(
                                insertId,
                                detail.ID_PRODUIT_STOCK,
                                detail.QUANTITE,
                                detail.PRIX,
                                detail.QUANTITE * detail.PRIX
                        );
                }))

                const tout_commandes = (await commandeModel.findCommandesbyId(insertId))[0]
                console.log(tout_commandes)
                

                res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "enregistrement reussi avec Succès",
                        result: tout_commandes
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

module.exports = {
        findAllLivraisons,
        createAllCommandes,
        createAllLivraisons,
        findAllCommandes
}