const partenaireProduitModel = require('../models/partenaire.produit.model')
const Validation = require('../class/Validation')
const jwt = require("jsonwebtoken");
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const generateToken = require('../utils/generateToken');
const path = require("path");
const ProductUpload = require("../class/uploads/ProductUpload");
const { query } = require('../utils/db');
const { json } = require('express');
const createProduit = async (req, res) => {
        try {
                const getImageUri = (fileName) => {
                        if (!fileName) return null
                        if (fileName.indexOf("http") === 0) return fileName
                        return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
                }
                const {
                        ID_PRODUIT,
                        ID_CATEGORIE_PRODUIT,
                        ID_PRODUIT_SOUS_CATEGORIE,
                        ID_TAILLE,
                        NOM,
                        DESCRIPTION,
                        QUANTITE_STOCKE,
                        QUANTIPRIX,
                        DETAIL,
                        ID_STATUT
                } = req.body
                const Detail = JSON.parse(DETAIL)
                const { IMAGE_1, IMAGE_2, IMAGE_3 } = req.files || {}
                const validation = new Validation(
                        { ...req.body, ...req.files },
                        {
                                IMAGE_1: {
                                        required: true,
                                        image: 21000000
                                },
                                IMAGE_2: {
                                        image: 21000000
                                },
                                IMAGE_3: {
                                        image: 21000000
                                },
                                ID_PRODUIT:
                                {
                                        exists: "ecommerce_produits,ID_PRODUIT",
                                },
                                ID_CATEGORIE_PRODUIT:
                                {
                                        exists: "ecommerce_produit_categorie,ID_CATEGORIE_PRODUIT",
                                },
                                ID_PRODUIT_SOUS_CATEGORIE:
                                {
                                        exists: "ecommerce_produit_sous_categorie,ID_PRODUIT_SOUS_CATEGORIE",
                                },
                                ID_TAILLE:
                                {
                                        exists: "ecommerce_produit_tailles,ID_TAILLE",
                                },
                                NOM:
                                {
                                        required: true,
                                },
                                DESCRIPTION:
                                {
                                        length: [1, 3000],
                                },
                                QUANTITE_STOCKE:
                                {
                                        required: true,
                                },
                                QUANTIPRIX: {
                                        required: true,
                                },
                                ID_STATUT:
                                {
                                        exists: "ecommerce_statut_prix,ID_STATUT",
                                },

                        },
                        {
                                IMAGE_1: {
                                        required: "Image d'un produit est obligatoire",
                                        image: "Veuillez choisir une image valide",
                                        size: "L'image est trop volumineux"
                                },
                                IMAGE_2: {
                                        image: "Veuillez choisir une image valide",
                                        size: "L'image est trop volumineux"
                                },
                                IMAGE_3: {
                                        image: "Veuillez choisir une image valide",
                                        size: "L'image est trop volumineux"
                                },
                                ID_PRODUIT:
                                {
                                        exists: "Produit  invalide",
                                },
                                ID_CATEGORIE_PRODUIT:
                                {
                                        exists: "categorie invalide",
                                },
                                ID_PRODUIT_SOUS_CATEGORIE:
                                {
                                        exists: "sous categorie invalide",
                                },
                                ID_TAILLE:
                                {
                                        exists: "taille invalide",
                                },
                                NOM:
                                {
                                        required: "nom du produit  est obligatoire"
                                },
                                DESCRIPTION:
                                {
                                        required: "Vérifier la taille de votre description(max: 3000 caractères)",
                                },
                                QUANTITE_STOCKE:
                                {
                                        required: "quantite  est obligatoire",
                                },
                                QUANTIPRIX: {
                                        required: "prix  est obligatoire",
                                },
                                ID_STATUT:
                                {
                                        exists: "statut du prix invalide",
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
                var filename_2
                var filename_3
                const { fileInfo: fileInfo_1, thumbInfo: thumbInfo_1 } = await productUpload.upload(IMAGE_1, false)
                if (IMAGE_2) {
                        const { fileInfo: fileInfo_2, thumbInfo: thumbInfo_2 } = await productUpload.upload(IMAGE_2, false)
                        filename_2 = fileInfo_2.fileName
                }
                if (IMAGE_3) {
                        const { fileInfo: fileInfo_3, thumbInfo: thumbInfo_3 } = await productUpload.upload(IMAGE_3, false)
                        filename_3 = fileInfo_3.fileName
                }

                const { insertId: insertProduit } = await partenaireProduitModel.createProduit(
                        ID_PRODUIT,
                        1,
                        ID_CATEGORIE_PRODUIT,
                        ID_PRODUIT_SOUS_CATEGORIE,
                        ID_TAILLE,
                        NOM,
                        DESCRIPTION ? DESCRIPTION : null,
                        fileInfo_1.fileName,
                        filename_2 ? filename_2 : null,
                        filename_3 ? filename_3 : null
                )
                const { insertId: insertStock } = await partenaireProduitModel.createStock(
                        insertProduit,
                        QUANTITE_STOCKE,
                        QUANTITE_STOCKE,
                        0,
                        //IMAGE
                )
                const { insertId: insertPrix } = await partenaireProduitModel.createPrix(
                        insertStock,
                        QUANTIPRIX,
                        1
                        //IMAGE
                )

                await Promise.all(Detail.map(async detail => {
                        const { insertId: id_details } = await partenaireProduitModel.createDetails(
                                insertProduit,
                                detail.sizeId,
                                detail.colorId,
                                detail.quantite,

                        );
                }))
                const produits = (await partenaireProduitModel.findById(insertProduit))[0]

                const categorie = (await query("select NOM from ecommerce_produit_categorie WHERE ID_CATEGORIE_PRODUIT=" + produits.ID_CATEGORIE_PRODUIT))[0]
                const souscategorie = (await query("select NOM from ecommerce_produit_sous_categorie WHERE ID_PRODUIT_SOUS_CATEGORIE=" + produits.ID_PRODUIT_SOUS_CATEGORIE))[0]
                const pdts = (await query("select NOM from ecommerce_produits  WHERE ID_PRODUIT=" + produits.ID_PRODUIT))[0]
                res.status(RESPONSE_CODES.CREATED).json({
                        statusCode: RESPONSE_CODES.CREATED,
                        httpStatus: RESPONSE_STATUS.CREATED,
                        message: "Enregistrement est fait avec succès",
                        result: {
                                ...produits,
                                IMAGE_1: getImageUri(produits.IMAGE_1),
                                IMAGE_2: getImageUri(produits.IMAGE_2),
                                IMAGE_3: getImageUri(produits.IMAGE_3),
                                categorie: categorie,
                                souscategorie: souscategorie,
                                pdts: pdts

                        }
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
        try {
                const { id_partenaire_service } = req.params
                const getImageUri = (fileName) => {
                        if (!fileName) return null
                        if (fileName.indexOf("http") === 0) return fileName
                        return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
                }
                const partenaire = (await query('SELECT * FROM partenaires WHERE ID_USER = ?', [req.userId]))[0]
                const Allproduits = await partenaireProduitModel.findByIdPartenaire(partenaire.ID_PARTENAIRE, id_partenaire_service)
                const products = await Promise.all(Allproduits.map(async product => {
                        const prix = (await partenaireProduitModel.findAllPrix(product.ID_PRODUIT_PARTENAIRE))[0]
                        if (prix) {
                                return {
                                        produit: {
                                                ID_PRODUIT: product.ID_PRODUIT,
                                                NOM: product.NOM,
                                                IMAGE: product.IMAGE_1
                                        },
                                        partenaire: {
                                                NOM_ORGANISATION: product.NOM_ORGANISATION,
                                                EMAIL: product.EMAIL,
                                        },
                                        produit_partenaire: {
                                                ID_PRODUIT_PARTENAIRE: product.ID_PRODUIT_PARTENAIRE,
                                                IMAGE_1: getImageUri(product.IMAGE_1),
                                                IMAGE_2: getImageUri(product.IMAGE_2),
                                                IMAGE_3: getImageUri(product.IMAGE_3),
                                                PRIX: prix.PRIX,
                                                NOM: product.NOM_ORGANISATION,
                                        },
                                        stock: {
                                                QUANTITE_STOCKE: prix.QUANTITE_TOTAL,
                                                QUANTITE_VENDUE: prix.QUANTITE_VENDUS,
                                                QUANTITE_RESTANTE: prix.QUANTITE_RESTANTE
                                        },
                                        taille: {
                                                ID_TAILLE: prix.ID_TAILLE,
                                                TAILLE: prix.TAILLE
                                        },
                                        couleur: {
                                                ID_COULEUR: prix.ID_COULEUR,
                                                COULEUR: prix.COULEUR
                                        },
                                        categorie: {
                                                ID_CATEGORIE_PRODUIT: product.ID_CATEGORIE_PRODUIT,
                                                NOM_CATEGORIE: product.NOM_CATEGORIE
                                        },
                                        sous_categorie: {
                                                ID_PRODUIT_SOUS_CATEGORIE: product.ID_PRODUIT_SOUS_CATEGORIE,
                                                SOUS_CATEGORIE: product.SOUS_CATEGORIE
                                        },
                                }
                        }
                }))
                res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "succès",
                        result: products
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

const findDetailsProduit = async (req, res) => {
        try {
                const { id_produit_partenaire } = req.params
                const getImageUri = (fileName) => {
                        if (!fileName) return null
                        if (fileName.indexOf("http") === 0) return fileName
                        return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
                }
                const Detailsproduits = await partenaireProduitModel.findProduitAllDetail(id_produit_partenaire)
                // const products = await Promise.all(Allproduits.map(async product => {
                //         const prix = (await partenaireProduitModel.findAllPrix(product.ID_PRODUIT_PARTENAIRE))[0]
                //         if (prix) {
                //                 return {
                //                         produit: {
                //                                 ID_PRODUIT: product.ID_PRODUIT,
                //                                 NOM: product.NOM,
                //                                 IMAGE: product.IMAGE_1
                //                         },
                //                         partenaire: {
                //                                 NOM_ORGANISATION: product.NOM_ORGANISATION,
                //                                 EMAIL: product.EMAIL,
                //                         },
                //                         produit_partenaire: {
                //                                 ID_PRODUIT_PARTENAIRE: product.ID_PRODUIT_PARTENAIRE,
                //                                 IMAGE_1: getImageUri(product.IMAGE_1),
                //                                 IMAGE_2: getImageUri(product.IMAGE_2),
                //                                 IMAGE_3: getImageUri(product.IMAGE_3),
                //                                 PRIX: prix.PRIX,
                //                                 NOM: product.NOM_ORGANISATION,
                //                         },
                //                         stock: {
                //                                 QUANTITE_STOCKE: prix.QUANTITE_TOTAL,
                //                                 QUANTITE_VENDUE: prix.QUANTITE_VENDUS,
                //                                 QUANTITE_RESTANTE: prix.QUANTITE_RESTANTE
                //                         },
                //                         taille: {
                //                                 ID_TAILLE: prix.ID_TAILLE,
                //                                 TAILLE: prix.TAILLE
                //                         },
                //                         couleur: {
                //                                 ID_COULEUR: prix.ID_COULEUR,
                //                                 COULEUR: prix.COULEUR
                //                         },
                //                         categorie: {
                //                                 ID_CATEGORIE_PRODUIT: product.ID_CATEGORIE_PRODUIT,
                //                                 NOM_CATEGORIE: product.NOM_CATEGORIE
                //                         },
                //                         sous_categorie: {
                //                                 ID_PRODUIT_SOUS_CATEGORIE: product.ID_PRODUIT_SOUS_CATEGORIE,
                //                                 SOUS_CATEGORIE: product.SOUS_CATEGORIE
                //                         },
                //                 }
                //         }
                // }))
                const produits = Detailsproduits.map(produit => ({
                        detail: {
                                ID_DETAIL: produit.ID_DETAIL,
                                ID_PRODUIT_PARTENAIRE:produit.ID_PRODUIT_PARTENAIRE,
                                ID_PARTENAIRE_SERVICE:produit.ID_PARTENAIRE_SERVICE,
                        },
                        produit: {
                                ID_PRODUIT: produit.ID_PRODUIT,
                                NOM:produit.NOM,
                                IMAGE_1: getImageUri(produit.IMAGE_1),
                                IMAGE_2: getImageUri(produit.IMAGE_2),
                                IMAGE_3: getImageUri(produit.IMAGE_3),
                        },
                        stock: {
                                QUANTITE_TOTAL: produit.QUANTITE_TOTAL,
                                QUANTITE_VENDUS:produit.QUANTITE_VENDUS,
                                QUANTITE_RESTANTE:produit.QUANTITE_RESTANTE,
                        },
                        categorie: {
                                ID_CATEGORIE_PRODUIT: produit.ID_CATEGORIE_PRODUIT,
                                NOM_CATEGORIE:produit.NOM_CATEGORIE,
                        },
                        sous_categorie: {
                                ID_PRODUIT_SOUS_CATEGORIE: produit.ID_PRODUIT_SOUS_CATEGORIE,
                                SOUS_CATEGORIE:produit.SOUS_CATEGORIE,
                        },
                        taille: {
                                ID_TAILLE: produit.ID_TAILLE,
                                TAILLE:produit.TAILLE,
                        },
                        couleur: {
                                ID_COULEUR: produit.ID_COULEUR,
                                COULEUR:produit.COULEUR,
                        },
                }))
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
                        message: "echoue",

                })
        }
}
const findByIdProduit = async (req, res) => {
        const { id } = req.params
        try {

                const produit = await partenaireProduitModel.findByIdPoduit(req.userId, id)
                res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "succès",
                        result: produit
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
        findByIdProduit,
        findDetailsProduit
}