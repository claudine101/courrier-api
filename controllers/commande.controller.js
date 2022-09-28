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

const createAllCommandes = async (req, res) => {
        try {
                const {	N0M,PRENOM,ADRESSE,AVENUE,ID_COUNTRY,DATE_LIVRAISON, result } = req.body
                const validation = new Validation(
                        req.body,
                        {
                                N0M:{
                                        required:true,
                                        length:[0,255]
                                },
                                PRENOM:{
                                        required:true,
                                        length:[0,255]
                                },
                                ADRESSE:{
                                        required:true,
                                        length:[0,255]
                                },
                                AVENUE:{
                                        required:true,
                                        length:[0,255]
                                },
                                ID_COUNTRY:{
                                        required:true,
                                        length:[0,255]
                                },
                        },{
                                N0M:{
                                        required:"Nom est obligatoiree",
                                        // length:"votre nom est  trop "
                                },
                                PRENOM:{
                                        required:"prenom est obligatoiree",
                                        length:"taille de prenom est invalide"
                                },
                                ADRESSE:{
                                        required:"adresse est obligatoiree",
                                        length:"taille d'adresse est invalide"
                                },
                                AVENUE:{
                                        required:"avenue est obligatoiree",
                                        length:"taille de l'avenue est invalide"
                                },
                                ID_COUNTRY:{
                                        required:"country est obligatoiree",
                                        length:"taille de country est invalide"
                                },
                        }

                )
                await Promise.all(result.map(async element => {
                        const stock = (await query("SELECT QUANTITE_STOCKE FROM ecommerce_produit_stock WHERE ID_PRODUIT_STOCK=?", [element.ID_PRODUIT_STOCK]))[0]
                        if (stock.QUANTITE_STOCKE < element.QUANTITE) {
                                await validation.setError(`ID_PRODUIT_STOCK_${element.ID_PRODUIT_STOCK}`, 'Quantite insuffisante')
                        }
                }))
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
                const { insertId } = await commandeModel.createCommandes(
                        req.userId,
                        DATE_LIVRAISON,
                        CODE_UNIQUE

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
                await commandeModel.createDetailLivraison(CODE_UNIQUE,N0M,PRENOM,ADRESSE,AVENUE,ID_COUNTRY)
                const tout_commandes = (await commandeModel.findCommandesbyId(insertId))[0]
                const produit = await commandeModel.findProduit(insertId)
                
                res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "enregistrement reussi avec Succès",
                        result: {
                                ...tout_commandes,
                                produits: produit
                        }
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

        createAllCommandes,

}