const RESPONSE_CODES = require("../constants/RESPONSE_CODES.js")
const RESPONSE_STATUS = require("../constants/RESPONSE_STATUS.js")
const productsModel = require("../models/products.model.js")
const { query } = require("../utils/db")

const getAllProducts = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }
        const { category, subCategory, limit, offset } = req.query
        console.log(category,subCategory)
        const allProducts = await productsModel.findproducts(category, subCategory, limit, offset)
        const products = allProducts.map(product => ({
            produit: {
                ID_PRODUIT: product.ID_PRODUIT,
                NOM: product.NOM,
                IMAGE: product.IMAGE
            },
            partenaire: {
                NOM_ORGANISATION: product.NOM_ORGANISATION,
                ID_PARTENAIRE: product.ID_PARTENAIRE,
                ID_TYPE_PARTENAIRE: product.ID_TYPE_PARTENAIRE,
                NOM: product.NOM_USER,
                PRENOM: product.PRENOM
            },
            produit_partenaire: {
                ID_PRODUIT_SERVICE: product.ID_PARTENAIRE_SERVICE,
                NOM: product.NOM_PRODUIT_PARTENAIRE,
                DESCRIPTION: product.DESCRIPTION,
                IMAGE_1: getImageUri(product.IMAGE_1),
                IMAGE_2: getImageUri(product.IMAGE_2),
                IMAGE_3: getImageUri(product.IMAGE_3),
                TAILLE: product.NOM_TAILLE,
                PRIX: product.PRIX
            },
            categorie: {
                ID_CATEGORIE_PRODUIT: product.ID_CATEGORIE_PRODUIT,
                NOM: product.NOM_CATEGORIE
            },
            sous_categorie: {
                ID_PRODUIT_SOUS_CATEGORIE: product.ID_PRODUIT_SOUS_CATEGORIE,
                NOM: product.NOM_SOUS_CATEGORIE
            },
            stock: {
                ID_PRODUIT_STOCK: product.ID_PRODUIT_STOCK,
                QUANTITE_STOCKE: product.QUANTITE_TOTAL,
                QUANTITE_RESTANTE: product.QUANTITE_RESTANTE,
                QUANTITE_VENDUE: product.QUANTITE_VENDUS
            }
        }))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des produits",
            result: products
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


const getOne = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }

        const { ID_PRODUIT } = req.params

        const oneProduct = await productsModel.findone(ID_PRODUIT)
        const products = oneProduct.map(product => ({
            produit: {
                ID_PRODUIT: product.ID_PRODUIT,
                NOM: product.NOM,
                IMAGE: product.IMAGE
            },
            produit_partenaire: {
                ID_PRODUIT: product.ID_PRODUIT,
                NOM_ORGANISATION: product.NOM_ORGANISATION,
                NOM: product.NOM_PRODUIT_PARTENAIRE,
                DESCRIPTION: product.DESCRIPTION,
                IMAGE_1: getImageUri(product.IMAGE_1),
                IMAGE_2: getImageUri(product.IMAGE_2),
                IMAGE_3: getImageUri(product.IMAGE_3),
                TAILLE: product.NOM_TAILLE,
                PRIX: product.PRIX
            },
            categorie: {
                ID_CATEGORIE_PRODUIT: product.ID_CATEGORIE_PRODUIT,
                NOM: product.NOM_CATEGORIE
            },
            sous_categorie: { 
                ID_PRODUIT_SOUS_CATEGORIE: product.ID_PRODUIT_SOUS_CATEGORIE,
                NOM: product.NOM_SOUS_CATEGORIE
            },
            stock: {
                ID_PRODUIT_STOCK: product.ID_PRODUIT_STOCK,
                QUANTITE_STOCKE: product.QUANTITE_STOCKE,
                QUANTITE_RESTANTE: product.QUANTITE_RESTANTE,
                QUANTITE_VENDUE: product.QUANTITE_VENDUE
            }
        }))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Le produit",
            result: products
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
const getbyID = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }

        const { ID_PARTENAIRE_SERVICE, limit, offset } = req.params

        const oneProduct = await productsModel.findBYidPartenaire(ID_PARTENAIRE_SERVICE, limit, offset)
        const products = oneProduct.map(product => ({
            produit: {
                ID_PRODUIT: product.ID_PRODUIT,
                NOM: product.NOM,
                IMAGE: product.IMAGE
            },
            produit_Service: {
                ID_PARTENAIRE_SERVICE: product.ID_PARTENAIRE_SERVICE,
                NOM_ORGANISATION: product.NOM_ORGANISATION,
                NOM: product.NOM,
                DESCRIPTION: product.DESCRIPTION,
                IMAGE_1: getImageUri(product.IMAGE_1),
                IMAGE_2: getImageUri(product.IMAGE_2),
                IMAGE_3: getImageUri(product.IMAGE_3),
                TAILLE: product.TAILLE,
                PRIX: product.PRIX
            },
            categorie: {
                ID_CATEGORIE_PRODUIT: product.ID_CATEGORIE_PRODUIT,
                NOM: product.NOM_CATEGORIE
            },
            sous_categorie: {
                ID_PRODUIT_SOUS_CATEGORIE: product.ID_PRODUIT_SOUS_CATEGORIE,
                NOM: product.NOM_SOUS_CATEGORIE
            },
            stock: {
                ID_PRODUIT_STOCK: product.ID_PRODUIT_STOCK,
                QUANTITE_STOCKE: product.QUANTITE_TOTAL,
                QUANTITE_RESTANTE: product.QUANTITE_RESTANTE,
                QUANTITE_VENDUE: product.QUANTITE_VENDUS
            }
        }))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Le produit",
            result: products
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

        const categories = await productsModel.findCategories()

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
const getAllColors = async (req, res) => {
    try {

        const colors = await query("SELECT * FROM ecommerce_produit_couleur")

        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des colors",
            result: colors


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
const getCategorieByPartenaire = async (req, res) => {
    try {
        const { ID_PRODUIT_PARTENAIRE } = req.params

        const categories = await productsModel.findById(ID_PRODUIT_PARTENAIRE)

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
const getAllSubCategories = async (req, res) => {
    try {

        const sous_categories = await productsModel.findSousCategories()
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des sous categories",
            result: sous_categories


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


const getSousCategoriesBy = async (req, res) => {
    try {
        const { ID_CATEGORIE_PRODUIT } = req.params
        const subCategories = await productsModel.findSousCategoriesBy(ID_CATEGORIE_PRODUIT)
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des sous categories des produits",
            result: subCategories


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
const getSizes = async (req, res) => {
    try {
        const { ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE } = req.params
        console.log(ID_PRODUIT_SOUS_CATEGORIE)
        const sizes = await productsModel.findSizes(ID_CATEGORIE_PRODUIT, ID_PRODUIT_SOUS_CATEGORIE)
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des tailles des produits",
            result: sizes
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
    getAllProducts,
    getAllCategorie,
    getSousCategoriesBy,
    getSizes,
    getAllSubCategories,
    getOne,
    getCategorieByPartenaire,
    getbyID,
    getAllColors


}