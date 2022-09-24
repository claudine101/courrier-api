const RESPONSE_CODES = require("../constants/RESPONSE_CODES.js")
const RESPONSE_STATUS = require("../constants/RESPONSE_STATUS.js")
const productsModel = require("../models/products.model.js")
const { query } = require("../utils/db")

const getAllProducts = async (req, res) => {
          try {
                    const getImageUri = (fileName) => {
                              if(!fileName) return null
                              if(fileName.indexOf("http") === 0)return fileName
                              return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
                    }
                    const { category, subCategory, limit, offset } = req.query
                    console.log(category)
                    const allProducts = await productsModel.findproducts(category, subCategory, limit, offset)
                    const products = allProducts.map(product => ({
                              produit: {
                                        ID_PRODUIT: product.ID_PRODUIT,
                                        NOM: product.NOM,
                                        IMAGE: product.IMAGE
                              },
                              produit_partenaire: {
                                        ID_PRODUIT_PARTENAIRE: product.ID_PRODUIT_PARTENAIRE,
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
                                        QUANTITE_STOCKE: product.QUANTITE_STOCKE,
                                        QUANTITE_RESTANTE: product.QUANTITE_RESTANTE,
                                        QUANTITE_VENDUE: product.QUANTITE_VENDUE
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
                    const { ID_CATEGORIE_PRODUIT } = req.params
                    const sizes = await productsModel.findSizes(ID_CATEGORIE_PRODUIT)
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
          getAllSubCategories
}