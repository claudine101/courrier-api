const stockmodel = require('../models/stock.model')
const Validation = require('../class/Validation')
const jwt = require("jsonwebtoken");
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const generateToken = require('../utils/generateToken');
const path = require("path");
const ProductUpload = require("../class/uploads/ProductUpload");
const { query } = require('../utils/db');
const { json } = require('express');

const createProduitStock = async (req, res) => {
        try {
                const getImageUri = (fileName) => {
                        if (!fileName) return null
                        if (fileName.indexOf("http") === 0) return fileName
                        return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
                }
                const {
                        ID_CATEGORIE_PRODUIT,
                        ID_PRODUIT_SOUS_CATEGORIE,
                        NOM,
                        DETAIL,
                        PRODUIT

                } = req.body

                const AllDetail = JSON.parse(DETAIL)
                if(PRODUIT){
                        var AllProduits = JSON.parse(PRODUIT)
                }
                const { IMAGE_1, IMAGE_2, IMAGE_3 } = req.files || {}
                const validation = new Validation(
                        { ...req.body, ...req.files },
                        {
                                IMAGE_1: {
                                        image: 21000000
                                },

                        },
                        {
                                IMAGE_1: {
                                        image: "Veuillez choisir une image valide",
                                        size: "L'image est trop volumineux"
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
                const productUpload = new ProductUpload()
                if (!PRODUIT) {
                        var filename_1
                        var filename_2
                        var filename_3
                        if (IMAGE_2) {
                                const { fileInfo: fileInfo_1, thumbInfo: thumbInfo_1 } = await productUpload.upload(IMAGE_1, false)
                                filename_1 = fileInfo_1.fileName
                        }
                        if (IMAGE_2) {
                                const { fileInfo: fileInfo_2, thumbInfo: thumbInfo_2 } = await productUpload.upload(IMAGE_2, false)
                                filename_2 = fileInfo_2.fileName
                        }
                        if (IMAGE_3) {
                                const { fileInfo: fileInfo_3, thumbInfo: thumbInfo_3 } = await productUpload.upload(IMAGE_3, false)
                                filename_3 = fileInfo_3.fileName
                        }

                }


                var quantiteTotal = 0
                AllDetail.forEach(detail => {
                        quantiteTotal += parseInt(detail.quantite)

                })

                var StockId
                if (PRODUIT == "") {
                        const { insertId: insertProduit } = await stockmodel.createProduit(
                                ID_CATEGORIE_PRODUIT,
                                ID_PRODUIT_SOUS_CATEGORIE,
                                NOM,
                                filename_1 ? filename_1 : null,
                                filename_2 ? filename_2 : null,
                                filename_3 ? filename_3 : null,
                                1,
                                2
                        )
                        StockId = insertProduit
                }


                await Promise.all(AllDetail.map(async detail => {
                        var ID_TAILLE
                        if (detail.TailleSelect.ID_TAILLE == "autre") {
                                const { insertId: insertTaille } = await stockmodel.createProduitTaille(
                                        PRODUIT ? AllProduits.produit.ID_CATEGORIE_PRODUIT : ID_CATEGORIE_PRODUIT,
                                        PRODUIT ? AllProduits.produit.ID_PRODUIT_SOUS_CATEGORIE : ID_PRODUIT_SOUS_CATEGORIE,
                                        detail.TailleSelect.TAILLE,
                                        1,
                                        2
                                )
                                ID_TAILLE = insertTaille
                        } else {
                                ID_TAILLE = detail.TailleSelect.ID_TAILLE
                        }

                        if (detail.selectedCouleur.ID_COULEUR == "autre") {
                                const { insertId: insertTaille } = await stockmodel.createProduitCouleur(
                                        detail.selectedCouleur.COULEUR,
                                        PRODUIT ? AllProduits.produit.ID_CATEGORIE_PRODUIT : ID_CATEGORIE_PRODUIT,
                                        PRODUIT ? AllProduits.produit.ID_PRODUIT_SOUS_CATEGORIE : ID_PRODUIT_SOUS_CATEGORIE,
                                        1,
                                        2
                                )
                        }

                        const { insertId: insertStock } = await stockmodel.createProduitStock(
                                2,
                                ID_TAILLE,
                                quantiteTotal,
                                0,
                                quantiteTotal
                        )
                }))




                res.status(RESPONSE_CODES.CREATED).json({
                        statusCode: RESPONSE_CODES.CREATED,
                        httpStatus: RESPONSE_STATUS.CREATED,
                        message: "Enregistrement est fait avec succès",
                        // result: {
                        //         // ...produits,
                        //         IMAGE_1: getImageUri(produits.IMAGE_1),
                        //         IMAGE_2: getImageUri(produits.IMAGE_2),
                        //         IMAGE_3: getImageUri(produits.IMAGE_3),
                        //         categorie: categorie,
                        //         souscategorie: souscategorie,
                        //         pdts: pdts

                        // }
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

const getAllProduit = async (req, res) => {
        try {
                const getImageUri = (fileName) => {
                        if (!fileName) return null
                        if (fileName.indexOf("http") === 0) return fileName
                        return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
                }
                const { limit, offset } = req.query
                const allProducts = await stockmodel.findproduits(limit, offset)
                // console.log(allProducts)
                const produits = allProducts.map(produit => ({
                        produit: {
                                ID_PRODUIT: produit.ID_PRODUIT,
                                ID_CATEGORIE_PRODUIT: produit.ID_CATEGORIE_PRODUIT,
                                ID_PRODUIT_SOUS_CATEGORIE: produit.ID_PRODUIT_SOUS_CATEGORIE,
                                NOM: produit.NOM,
                                NOM_CATEGORIE: produit.NOM_CATEGORIE,
                                NOM_SOUS_CATEGORIE: produit.NOM_SOUS_CATEGORIE,
                                IMAGE_1: getImageUri(produit.IMAGE_1),
                                IMAGE_2: getImageUri(produit.IMAGE_2),
                                IMAGE_3: getImageUri(produit.IMAGE_3),
                        },
                }))

                res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "Liste des produits",
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

const getAllCategorie = async (req, res) => {
        try {

                const categories = await stockmodel.findCategories()

                res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "Liste des categories",
                        result: categories


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

const getAllSousCategorie = async (req, res) => {
        try {
                const { id_categorie } = req.params

                const categories = await stockmodel.findSousCategories(id_categorie)

                res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "Liste des sous categories",
                        result: categories


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



const getAllCouleur = async (req, res) => {
        try {
                const { ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE } = req.query
                const AllCouleur = await stockmodel.findCouleurs(ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE)
                res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "Liste des couleurs",
                        result: AllCouleur


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

const getAllTaille = async (req, res) => {
        try {
                const { ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE } = req.query
                const AllTaille = await stockmodel.findTailles(ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE)
                res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "Liste des tailles",
                        result: AllTaille


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
        createProduitStock,
        getAllProduit,
        getAllCategorie,
        getAllSousCategorie,
        getAllCouleur,
        getAllTaille
}