const commandeModel = require('../Models/commandeModel')
const Validation = require('../class/Validation')
const jwt = require("jsonwebtoken");
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const generateToken = require('../utils/generateToken');
const path = require("path");
const moment = require("moment");

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
                                },
                                PRENOM:
                                {
                                        required: true,
                                },
                                ADRESSE:
                                {
                                        required: true,
                                },

                                LONGITUDE:
                                {
                                        required: true,
                                },
                                LATITUDE:
                                {
                                        required: true,
                                },

                        },
                        {

                                NOM:
                                {
                                        required: "Mot de passe est obligatoire",
                                },
                                PRENOM: {
                                        required: "L'email est obligatoire",
                                },
                                ADRESSE: {
                                        required: "L'email est obligatoire",
                                },
                                LONGITUDE: {
                                        required: "L'email est obligatoire",
                                },
                                LATITUDE: {
                                        required: "L'email est obligatoire",
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
                res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "enregistrement reussi avec Succès",
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
                // const validation = new Validation(req.body)
                // await validation.run()

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


                res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "enregistrement reussi avec Succès",
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