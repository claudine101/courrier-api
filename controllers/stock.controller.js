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
                        ID_PARTENAIRE_SERVICE,
                        ID_PRODUIT,
                        ID_TAILLE,
                        QUANTITE_TOTAL,
                        ID_CATEGORIE_PRODUIT,
                        ID_PRODUIT_SOUS_CATEGORIE,
                        IS_AUTRE,
                        NOM,
                        TAILLE,
                        NOM_CATEGORIE,
                        NOM_SOUS_CATEGORIE
                } = req.body
                console.log(IS_AUTRE)
                const { IMAGE_1, IMAGE_2, IMAGE_3 } = req.files || {}
                const validation = new Validation(
                        { ...req.body, ...req.files },
                        {
                                IMAGE_1: {
                                        image: 21000000
                                },
                                ID_PARTENAIRE_SERVICE:
                                {
                                        exists: "partenaire_service,ID_PARTENAIRE_SERVICE",
                                },
                                ID_PRODUIT:
                                {
                                        exists: "ecommerce_produits,ID_PRODUIT",
                                },
                                ID_TAILLE:
                                {
                                        exists: "ecommerce_produit_tailles,ID_TAILLE",
                                },
                                ID_CATEGORIE_PRODUIT:
                                {
                                        exists: "ecommerce_produit_categorie,ID_CATEGORIE_PRODUIT",
                                },
                                ID_PRODUIT_SOUS_CATEGORIE:
                                {
                                        exists: "ecommerce_produit_sous_categorie,ID_PRODUIT_SOUS_CATEGORIE",
                                },
                                QUANTITE_TOTAL:
                                {
                                        required: true,
                                },

                        },
                        {
                                IMAGE_1: {
                                        image: "Veuillez choisir une image valide",
                                        size: "L'image est trop volumineux"
                                },
                                ID_PARTENAIRE_SERVICE:
                                {
                                        exists: "Partenaire  invalide",
                                },
                                ID_PRODUIT:
                                {
                                        exists: "produit  invalide",
                                },
                                ID_TAILLE:
                                {
                                        exists: "Taille  invalide",
                                },
                                ID_CATEGORIE_PRODUIT:
                                {
                                        exists: "Categorie  invalide",
                                },
                                ID_PRODUIT_SOUS_CATEGORIE:
                                {
                                        exists: "Sous categorie  invalide",
                                },
                                QUANTITE_QUANTITE_TOTALSTOCKE:
                                {
                                        required: "quantite  est obligatoire",
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
                if (IS_AUTRE == 1) {
                        var filename_1
                        var filename_2
                        var filename_3

                        if (IMAGE_1) {
                                const { fileInfo: fileInfo_1, thumbInfo: thumbInfo_1 } = await productUpload.upload(IMAGE_1, false)
                                filename_1 = fileInfo_1.fileName
                        }
                        const { fileInfo: fileInfo_1, thumbInfo: thumbInfo_1 } = await productUpload.upload(IMAGE_1, false)
                        if (IMAGE_2) {
                                const { fileInfo: fileInfo_2, thumbInfo: thumbInfo_2 } = await productUpload.upload(IMAGE_2, false)
                                filename_2 = fileInfo_2.fileName
                        }
                        if (IMAGE_3) {
                                const { fileInfo: fileInfo_3, thumbInfo: thumbInfo_3 } = await productUpload.upload(IMAGE_3, false)
                                filename_3 = fileInfo_3.fileName
                        }
                }

                const { insertId: insertProduit } = await stockmodel.createProduitStock(
                        ID_PARTENAIRE_SERVICE,
                        ID_PRODUIT,
                        ID_TAILLE,
                        QUANTITE_TOTAL,
                        0,
                        QUANTITE_TOTAL
                )
                console.log(IS_AUTRE == 1)
                if (IS_AUTRE == 1) {
                        console.log("bonjour")
                        const { insertId: insertStock } = await stockmodel.createProduit(
                                ID_CATEGORIE_PRODUIT,
                                ID_PRODUIT_SOUS_CATEGORIE,
                                NOM,
                                // fileInfo_1.fileName,
                                filename_1 ? filename_1 : null,
                                filename_2 ? filename_2 : null,
                                filename_3 ? filename_3 : null,
                                1,
                                ID_PARTENAIRE_SERVICE
                                //IMAGE
                        )
                }
                if (IS_AUTRE == 1) {
                        console.log("bonjour")
                        const { insertId: insertTaille } = await stockmodel.createProduitTaille(
                                ID_CATEGORIE_PRODUIT,
                                ID_PRODUIT_SOUS_CATEGORIE,
                                TAILLE,
                                1,
                                ID_PARTENAIRE_SERVICE
                                //IMAGE
                        )
                }

                if (IS_AUTRE == 1) {
                        console.log("bonjour")
                        const { insertId: insertCatego } = await stockmodel.createProduitCategorie(
                                NOM_CATEGORIE,
                                filename_1,
                                1,
                                ID_PARTENAIRE_SERVICE
                                //IMAGE
                        )
                }

                if (IS_AUTRE == 1) {
                        const { insertId: insertSousCatego } = await stockmodel.createProduitSousCategorie(
                                ID_CATEGORIE_PRODUIT,
                                NOM_SOUS_CATEGORIE,
                                filename_1,
                                1,
                                ID_PARTENAIRE_SERVICE
                                //IMAGE
                        )
                }



                // const produits = (await partenaireProduitModel.findById(insertProduit))[0]

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
                const { ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE} = req.query
                const AllCouleur = await stockmodel.findCouleurs(ID_CATEGORIE_PRODUIT,ID_PRODUIT_SOUS_CATEGORIE)
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
                const { ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE} = req.query
                const AllTaille = await stockmodel.findTailles(ID_CATEGORIE_PRODUIT,ID_PRODUIT_SOUS_CATEGORIE)
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