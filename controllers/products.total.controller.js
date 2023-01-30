const productstotalModel = require('../models/commande.total.model')
const Validation = require('../class/Validation')

const jwt = require("jsonwebtoken");
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const path = require("path");
const moment = require("moment");
const { query } = require('../utils/db');

/**
 * la fonction pour recuperer le nombre de produits deja vendus sur une article quelconques
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 30/01/2023
 * @param {*} req 
 * @param {*} res 
 */

const countProduitVendus = async (req, res) => {
        try {
                const { ID_PRODUIT } = req.query
                const produitVendus = (await productstotalModel.getProductsVendus(ID_PRODUIT))[0]
                res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "Nombre des produits deja vendus",
                        result: produitVendus
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

const countProduit = async (req, res) => {
        try{
                const { ID_PRODUIT } = req.query
                const allProduits = (await productstotalModel.getCountProducts(ID_PRODUIT))[0]
                res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "Nombre des produits dans le stock",
                        result: allProduits
                })
        }
        catch(error){
                console.log(error)
                res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                        statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                        httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                        message: "Erreur interne du serveur, réessayer plus tard",
                })
        }
}

const countNotesProduit = async (req, res) => {
        try{
                const { ID_PRODUIT } = req.query
                const notesProduits = (await productstotalModel.getNotesProducts(ID_PRODUIT))[0]
                res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "Nombre de notes sur un produit",
                        result: notesProduits
                })
        }
        catch(error){
                console.log(error)
                res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                        statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                        httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                        message: "Erreur interne du serveur, réessayer plus tard",
                })
        }
}

const countWishlist = async (req, res) => {
        try{
                const { ID_PRODUIT } = req.query
                const wishlist = (await productstotalModel.getWishlist(ID_PRODUIT))[0]
                res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "Nombre de wishlist",
                        result: wishlist
                })
        }
        catch(error){
                console.log(error)
                res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                        statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                        httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                        message: "Erreur interne du serveur, réessayer plus tard",
                })
        }
}

module.exports = {
        countProduitVendus,
        countProduit,
        countNotesProduit,
        countWishlist
}