const RESPONSE_CODES = require("../constants/RESPONSE_CODES.js")
const RESPONSE_STATUS = require("../constants/RESPONSE_STATUS.js")
const productsModel = require("../models/products.model.js")
const { query } = require("../utils/db")
const getAllProducts = async (req, res) => {
    try {
        const {category}=req.query
        const products = await productsModel.findproducts(category)
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
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
const getAllCategorie = async (req, res) => {
    try {
        
        const categories = await productsModel.findCategories()
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
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

const getAllSousCategories = async (req, res) => {
    try {
        const { ID_CATEGORIE_PRODUIT } = req.params
        const subCategories = await productsModel.findSousCategories(ID_CATEGORIE_PRODUIT)
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
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
        const { ID_CATEGORIE_PRODUIT } = req.params
        const sizes = await productsModel.findSizes(ID_CATEGORIE_PRODUIT)
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Liste des tailles des produits",
            result:sizes


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
    getAllSousCategories,
    getSizes
}