const RESPONSE_CODES = require("../constants/RESPONSE_CODES.js")
const RESPONSE_STATUS = require("../constants/RESPONSE_STATUS.js")
const productsModel = require("../models/products.model.js")
const { query } = require("../utils/db")
const Validation = require('../class/Validation')
const getAllProducts = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }
        const { q, category, subCategory, limit, offset } = req.query
        const allProducts = await productsModel.findproducts(q, category, subCategory, limit, offset)
        const products = await Promise.all(allProducts.map(async product => {
            const prix = (await productsModel.getPrix(product.ID_PRODUIT_PARTENAIRE))[0]
            if (prix) {
                return {
                    produit: {
                        ID_PRODUIT: product.ID_PRODUIT,
                        NOM: product.NOM,
                        ID_PRODUIT_PARTENAIRE: product.ID_PRODUIT_PARTENAIRE,

                        IMAGE: getImageUri(product.IMAGE_1),
                    },
                    partenaire: {
                        NOM_ORGANISATION: product.NOM_ORGANISATION,
                        ID_PARTENAIRE: product.ID_PARTENAIRE,
                        ID_TYPE_PARTENAIRE: product.ID_TYPE_PARTENAIRE,
                        NOM: product.NOM_USER,
                        PRENOM: product.PRENOM
                    },
                    produit_partenaire: {
                        ID_PARTENAIRE_SERVICE: product.ID_PARTENAIRE_SERVICE,
                        NOM_ORGANISATION: product.NOM_ORGANISATION,
                        NOM: product.NOM_PRODUIT_PARTENAIRE,
                        DESCRIPTION: product.DESCRIPTION,
                        IMAGE_1: getImageUri(product.IMAGE_1),
                        IMAGE_2: getImageUri(product.IMAGE_2),
                        IMAGE_3: getImageUri(product.IMAGE_3),
                        TAILLE: product.NOM_TAILLE,
                        PRIX: prix.PRIX
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
                }
            }
        }
        ))
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
const getAllProduct = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }
        const { wishlist, category, subCategory, limit, offset } = req.query

        const allProducts = await productsModel.findproduct(req.userId, category, subCategory, limit, offset)
        const products = await Promise.all(allProducts.map(async product => {
             const prix = (await productsModel.getPrix(product.ID_PRODUIT_PARTENAIRE))[0]
             //if (prix) 
             {
            return {
                produit: {
                    ID_PRODUIT: product.ID_PRODUIT,
                    NOM: product.NOM,
                    ID_PRODUIT_PARTENAIRE: product.ID_PRODUIT_PARTENAIRE,

                    IMAGE: getImageUri(product.IMAGE_1),
                },
                partenaire: {
                    NOM_ORGANISATION: product.NOM_ORGANISATION,
                    ID_PARTENAIRE: product.ID_PARTENAIRE,
                    ID_TYPE_PARTENAIRE: product.ID_TYPE_PARTENAIRE,
                    NOM: product.NOM_USER,
                    PRENOM: product.PRENOM
                },
                produit_partenaire: {
                    ID_PARTENAIRE_SERVICE: product.ID_PARTENAIRE_SERVICE,
                    NOM_ORGANISATION: product.NOM_ORGANISATION,
                    NOM: product.NOM_PRODUIT_PARTENAIRE,
                    DESCRIPTION: product.DESCRIPTION,
                    IMAGE_1: getImageUri(product.IMAGE_1),
                    IMAGE_2: getImageUri(product.IMAGE_2),
                    IMAGE_3: getImageUri(product.IMAGE_3),
                    TAILLE: product.NOM_TAILLE,
                    PRIX: prix.PRIX
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
            }
        }
            }
        ))
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
        const details = await Promise.all(oneProduct.map( async product => { 
            const detail = (await productsModel.getdetail(product.ID_PRODUIT_PARTENAIRE))
              
            return {
                produit: {
                    ID_PRODUIT: product.ID_PRODUIT,
                    NOM: product.NOM,
                    IMAGE: product.IMAGE,
                    ID_PRODUIT_PARTENAIRE: product.ID_PRODUIT_PARTENAIRE,
                },
                partenaire: {
                    NOM_ORGANISATION: product.NOM_ORGANISATION,
                    ID_PARTENAIRE: product.ID_PARTENAIRE,

                },
                produit_partenaire: {
                    ID_PARTENAIRE_SERVICE: product.ID_PARTENAIRE_SERVICE,
                    NOM_ORGANISATION: product.NOM_ORGANISATION,
                    NOM: product.NOM,
                    DESCRIPTION: product.DESCRIPTION,
                    IMAGE_1: getImageUri(product.IMAGE_1),
                    IMAGE_2: getImageUri(product.IMAGE_2),
                    IMAGE_3: getImageUri(product.IMAGE_3),
                    TAILLE: detail.TAILLE,
                    PRIX: product.PRIX
                },
                categorie: {
                    ID_CATEGORIE_PRODUIT: product.ID_CATEGORIE_PRODUIT,
                    NOM:product.NOM_CATEGORIE
                },
                sous_categorie: {
                    ID_PRODUIT_SOUS_CATEGORIE: product.ID_PRODUIT_SOUS_CATEGORIE,
                    NOM:product.NOM_SOUS_CATEGORIE
                },
                detail: {
                    ID_PRODUIT_STOCK: product.ID_PRODUIT_STOCK,
                    QUANTITE_STOCKE:detail.QUANTITE_TOTAL,
                    QUANTITE_RESTANTE:detail.QUANTITE_RESTANTE,
                    QUANTITE_VENDUE:detail.QUANTITE_VENDUS
                }
            }
        
            
        }))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Le produit",
            result: details
        })
        console.log(details)
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

const getDeatail = async (req, res) => {
    try {
        const { ID_PRODUIT_PARTENAIRE, limit, offset } = req.params
        const details = await productsModel.finddetails(ID_PRODUIT_PARTENAIRE)

        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Les deatils prduits",
            result: details


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


const getAllNotes = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }

        const { ID_PRODUIT_PARTENAIRE, limit, offset } = req.params

        const noteListe = await productsModel.findBYidProduitPartenaire(ID_PRODUIT_PARTENAIRE, limit, offset)
        const notes = noteListe.map(note => ({
            produit_note: {
                NOTE: note.NOTE,
                COMENTAIRE: note.COMMENTAIRE,
                DATE: note.DATE_INSERTION,
                ID_PRODUIT_PARTENAIRE: note.ID_PRODUIT_PARTENAIRE
            },

            utilisateur: {

                IMAGE: getImageUri(note.IMAGE),
                ID_USER: note.ID_USER,
                NOM: note.NOM,
                PRENOM: note.PRENOM






            },


        }))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Les notes",
            result: notes
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
const getnotes = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }

        const { ID_PRODUIT_PARTENAIRE } = req.params

        const noteListe = await productsModel.findnoteProduitPartenaire(ID_PRODUIT_PARTENAIRE, req.userId)

        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "La commentaire",
            result: noteListe
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

const insertNote = async (req, res) => {

    try {


        const { ID_PRODUIT_PARTENAIRE, NOTE, COMMENTAIRE } = req.body
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }
        const validation = new Validation(req.body,
            {


                NOTE:
                {
                    required: true,
                },




            },
            {

                NOTE: {
                    required: "La note est obligatoire"
                },





            }

        )

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



        const { insertId } = await productsModel.createNotes(
            req.userId,
            ID_PRODUIT_PARTENAIRE,
            NOTE,
            COMMENTAIRE,

        )
        const note = (await productsModel.findById(insertId))[0]
        const notes = {
            produit_note: {
                NOTE: note.NOTE,
                COMENTAIRE: note.COMMENTAIRE,
                DATE: note.DATE_INSERTION,
                ID_PRODUIT_PARTENAIRE: note.ID_PRODUIT_PARTENAIRE
            },

            utilisateur: {

                IMAGE: getImageUri(note.IMAGE),
                ID_USER: note.ID_USER,
                NOM: note.NOM,
                PRENOM: note.PRENOM
            },
        }
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "le commentaire",
            result: notes


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
        const { ID_PARTENAIRE_SERVICE } = req.params

        const categories = await productsModel.findById(ID_PARTENAIRE_SERVICE)

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
const getSize = async (req, res) => {
    try {
        const { ID_PRODUIT_PARTENAIRE } = req.params
        const sizes = await productsModel.findSize(ID_PRODUIT_PARTENAIRE)
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
const getColor = async (req, res) => {
    try {
        const { ID_TAILLE, ID_PRODUIT_PARTENAIRE } = req.params
        const colors = await productsModel.findColor(ID_PRODUIT_PARTENAIRE, ID_TAILLE)
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des couleur des produits",
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

module.exports = {
    getColor,
    getAllProducts,
    getAllProduct,
    getAllCategorie,
    getSousCategoriesBy,
    getSizes,
    getSize,
    getAllSubCategories,
    getOne,
    getCategorieByPartenaire,
    getbyID,
    getAllColors,
    insertNote,
    getAllNotes,
    getnotes,
    getDeatail


}