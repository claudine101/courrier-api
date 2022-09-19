const produitModel = require('../Models/produit.model')
const Validation = require('../class/Validation')
const jwt = require("jsonwebtoken");
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const generateToken = require('../utils/generateToken');
const path = require("path");
const createProduit = async (req, res) => {
    try {
        const { 
            ID_PRODUIT,
            ID_PARTENAIRE,
            ID_CATEGORIE_PRODUIT,
            ID_PRODUIT_SOUS_CATEGORIE,
            ID_TAILLE,
            NOM,
            DESCRIPTION,
            
            
            QUANTITE_STOCKE,
            QUANTITE_RESTANTE,
            QUANTITE_VENDUE,
            DATE_INSERTION,

  
            QUANTIPRIX,
            ID_STATUT


        } = req.body

        const validation = new Validation(req.body)
        await validation.run();
        const isValide = await validation.isValidate()
        if (!isValide) {
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: "Probleme de validation des donnees",
                result: errors
            })

        }
        const { insertId:insertProduit } = await produitModel.createProduit(
            ID_PRODUIT,
            ID_PARTENAIRE,
            ID_CATEGORIE_PRODUIT,
            ID_PRODUIT_SOUS_CATEGORIE	,
            ID_TAILLE,
            NOM,
            DESCRIPTION
            //IMAGE
        )
        const { insertId:insertStock } = await produitModel.createStock(
            insertProduit,
            QUANTITE_STOCKE,
            0,
            0,
            //IMAGE
        )
        const { insertId:insertPrix } = await produitModel.createPrix(
            insertStock,
            QUANTIPRIX,
            ID_STATUT
            //IMAGE
        )
        const produit = (await produitModel.findById(insertProduit))[0]
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Enregistrement est fait avec succès",
            result: produit
        })
    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Enregistrement echoue",

        })
    }
}
const findByIdPartenaire = async (req, res) => {
    const {id}=req.params
    try {
    
        const service = await produitModel.findByIdPartenaire(id)
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "succès",
            result: service
        })
    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "echoue",

        })
    }
}
const findByIdProduit = async (req, res) => {
    const {id}=req.params
    try {
    
        const service = await produitModel.findByIdPartenaire(id)
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "succès",
            result: service
        })
    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "echoue",

        })
    }
}
module.exports = {
    createProduit,
    findByIdPartenaire,
    findByIdProduit
}