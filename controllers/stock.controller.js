const stockmodel = require('../models/stock.model')
const productsModel = require("../models/products.model.js")
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
                        ID_PARTENAIRE_SERVICE,
                        PRIX,
                        PRIXNOUVEAU,
                        DETAIL,
                        PRODUIT

                } = req.body
                const AllDetail = JSON.parse(DETAIL)
                if (PRODUIT) {
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
                        if (IMAGE_1) {
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
                var ID_PRODUIT_PARTENAIRE
                if (!PRODUIT) {
                        const { insertId: insertProduit } = await stockmodel.createProduit(
                                ID_CATEGORIE_PRODUIT,
                                ID_PRODUIT_SOUS_CATEGORIE,
                                NOM,
                                filename_1 ? filename_1 : null,
                                filename_2 ? filename_2 : null,
                                filename_3 ? filename_3 : null,
                                1,
                                ID_PARTENAIRE_SERVICE
                        )
                        StockId = insertProduit
                }
                if (PRODUIT) {
                        const { insertId: produitPartenaite } = await stockmodel.createProduitPartenaire(
                                ID_PARTENAIRE_SERVICE,
                                AllProduits.produit.ID_PRODUIT,
                        )
                        ID_PRODUIT_PARTENAIRE = produitPartenaite
                } else {
                        const { insertId: produitPartenaite } = await stockmodel.createProduitPartenaire(
                                ID_PARTENAIRE_SERVICE,
                                StockId,
                        )
                        ID_PRODUIT_PARTENAIRE = produitPartenaite
                }
                var ID_TAILLE
                const { insertId: insertStock } = await stockmodel.createProduitStock(
                        ID_PRODUIT_PARTENAIRE,
                        quantiteTotal,
                        0,
                        quantiteTotal
                )
                const { insertId: insertPrixStock } = await stockmodel.createProduitPrix(
                        insertStock,
                        PRIX ? PRIX : PRIXNOUVEAU,
                        1,
                )
                await Promise.all(AllDetail.map(async detail => {
                        if (detail.TailleSelect.ID_TAILLE == "autre") {
                                const { insertId: insertTaille } = await stockmodel.createProduitTaille(
                                        PRODUIT ? AllProduits.produit.ID_CATEGORIE_PRODUIT : ID_CATEGORIE_PRODUIT,
                                        PRODUIT ? AllProduits.produit.ID_PRODUIT_SOUS_CATEGORIE : ID_PRODUIT_SOUS_CATEGORIE,
                                        detail.TailleSelect.TAILLE,
                                        1,
                                        ID_PARTENAIRE_SERVICE
                                )
                                ID_TAILLE = insertTaille
                        } else {
                                ID_TAILLE = detail.TailleSelect.ID_TAILLE
                        }
                        var ID_COULEUR
                        if (detail.selectedCouleur.ID_COULEUR == "autre") {
                                const { insertId: insertCouleur } = await stockmodel.createProduitCouleur(
                                        detail.selectedCouleur.COULEUR,
                                        PRODUIT ? AllProduits.produit.ID_CATEGORIE_PRODUIT : ID_CATEGORIE_PRODUIT,
                                        PRODUIT ? AllProduits.produit.ID_PRODUIT_SOUS_CATEGORIE : ID_PRODUIT_SOUS_CATEGORIE,
                                        1,
                                        ID_PARTENAIRE_SERVICE
                                )
                                ID_COULEUR = insertCouleur
                        } else {
                                ID_COULEUR = detail.selectedCouleur.ID_COULEUR
                        }
                        const { insertId: insertDetailStock } = await stockmodel.createProduitDetailStock(
                                insertStock,
                                ID_COULEUR,
                                ID_TAILLE,
                                1,
                                detail.quantite,
                                0,
                                detail.quantite
                        )
                }))
                
                    const product = await productsModel.findproductByID(ID_PRODUIT_PARTENAIRE)
                    const prix = (await productsModel.getPrix(product[0].ID_PRODUIT_PARTENAIRE))[0]
                        var proctsFormat
                        if (prix) {
                                proctsFormat= { 
                                produit: {
                                    ID_PRODUIT: product[0].ID_PRODUIT,
                                    NOM: product[0].NOM,
                                    ID_PRODUIT_PARTENAIRE: product[0].ID_PRODUIT_PARTENAIRE,
            
                                    IMAGE: getImageUri(product[0].IMAGE_1),
                                },
                                partenaire: {
                                    NOM_ORGANISATION: product[0].NOM_ORGANISATION,
                                    ID_PARTENAIRE: product[0].ID_PARTENAIRE,
                                    ID_TYPE_PARTENAIRE: product[0].ID_TYPE_PARTENAIRE,
                                    NOM: product[0].NOM_USER,
                                    PRENOM: product[0].PRENOM
                                },
                                produit_partenaire: {
                                    ID_PARTENAIRE_SERVICE: product[0].ID_PARTENAIRE_SERVICE,
                                    NOM_ORGANISATION: product[0].NOM_ORGANISATION,
                                    NOM: product[0].NOM_PRODUIT_PARTENAIRE,
                                    DESCRIPTION: product[0].DESCRIPTION,
                                    IMAGE_1: getImageUri(product[0].IMAGE_1),
                                    IMAGE_2: getImageUri(product[0].IMAGE_2),
                                    IMAGE_3: getImageUri(product[0].IMAGE_3),
                                    TAILLE: product[0].NOM_TAILLE,
                                    PRIX: prix.PRIX
                                },
                                categorie: {
                                    ID_CATEGORIE_PRODUIT: product[0].ID_CATEGORIE_PRODUIT,
                                    NOM: product[0].NOM_CATEGORIE
                                },
                                sous_categorie: {
                                    ID_PRODUIT_SOUS_CATEGORIE: product[0].ID_PRODUIT_SOUS_CATEGORIE,
                                    NOM: product[0].NOM_SOUS_CATEGORIE
                                },
                                stock: {
                                    ID_PRODUIT_STOCK: product[0].ID_PRODUIT_STOCK,
                                    QUANTITE_STOCKE: product[0].QUANTITE_TOTAL,
                                    QUANTITE_RESTANTE: product[0].QUANTITE_RESTANTE,
                                    QUANTITE_VENDUE: product[0].QUANTITE_VENDUS
                                }
                            }
                        }
                res.status(RESPONSE_CODES.CREATED).json({
                        statusCode: RESPONSE_CODES.CREATED,
                        httpStatus: RESPONSE_STATUS.CREATED,
                        message: "Enregistrement est fait avec succès",
                        result: proctsFormat
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
                                PRIX: produit.PRIX
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

                const {q}=req.query
                const categories = await stockmodel.findCategories(q)
                res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "Liste deS categories",
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
                const {q}=req.query
                console.log(q)
                const categories = await stockmodel.findSousCategories(id_categorie,q)
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