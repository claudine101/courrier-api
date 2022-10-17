const wishlistModel = require('../models/wishlist.model')
const Validation = require('../class/Validation')
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const { query } = require('../utils/db');
const create = async (req, res) => {
    try {
        const {
            ID_PRODUIT_PARTENAIRE
        } = req.body
        const validation = new Validation(
            req.body,
            {
                
                ID_PRODUIT_PARTENAIRE:
                {
                    required: true,
                },
                
            },
            {
                ID_PRODUIT_PARTENAIRE:
                {
                    required: "partenaire  invalide",
                },
                
            }
        );
        await validation.run();
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
        const { insertId} = await wishlistModel.createOne(
            ID_PRODUIT_PARTENAIRE,
            req.userId
        )
        const wishlist = (await wishlistModel.findById(insertId))[0]
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Enregistrement est fait avec succès",
            result: wishlist
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
const suppression = async (req, res) => {
    try {
        const { ID_PRODUIT_PARTENAIRE } = req.params
        const wishlistDelete = await  query("DELETE FROM ecommerce_wishlist_produit  WHERE ID_PRODUIT_PARTENAIRE= ?",[ID_PRODUIT_PARTENAIRE])

              res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "suppression faite avec succès",
                        result: wishlistDelete
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
const verfication = async (req, res) => {
    try {
        const { ID_PRODUIT_PARTENAIRE} = req.params

        const wishlist= (await  query("SELECT ID_WISHLIST FROM ecommerce_wishlist_produit  WHERE ID_PRODUIT_PARTENAIRE= ? AND ID_USERS",[ID_PRODUIT_PARTENAIRE,req.userId]))[0]
              res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "existe",
                        result: wishlist
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
    create,
    suppression,
    verfication
}