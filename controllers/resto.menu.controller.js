const RESPONSE_CODES = require('../constants/RESPONSE_CODES')
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS')
const restoMenuModel = require('../models/resto.menu.model')
const getAllCategories = async (req, res) => {
    try {

        const menucategories = await restoMenuModel.findmenucategories()
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_CODES.OK,
            message: "Liste des menucategories",
            result: menucategories


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
const getSousCategories = async (req, res) => {
    try {
        const { ID_CATEGORIE_MENU } = req.params
        const menusouscategories = await restoMenuModel.findmenusouscategories(ID_CATEGORIE_MENU)
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_CODES.OK,
            message: "Liste des  sous menu categories",
            result: menusouscategories


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

const getAllPartenaire = async (req, res) => {

    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/users/${fileName}`
        }
        const { category, subCategory, limit, offset } = req.query
        const allPartenaire = await userModel.findpartenaire(category, subCategory, limit, offset)

        const partenaires = await Promise.all(allPartenaire.map(async partenaire => {
            const categorie = await userModel.findbycategorie(partenaire.ID_PARTENAIRE)
            return {
                ...partenaire,
                image: getImageUri(partenaire.IMAGE),
                categories: categorie
            }
        }))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des produits",
            result: partenaires
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
const getmenu = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/menu/${fileName}`
        }
        const { partenaire,category } = req.query
        var menu = await restoMenuModel.findmenu()
        const menus = await Promise.all(menu.map(async m => {
            // const categorie = await userModel.findbycategorie(partenaire.ID_PARTENAIRE)
            return {
                ...m,
                IMAGE: getImageUri(m.IMAGES_1),
                IMAGE2: getImageUri(m.IMAGES_2),
                IMAGE3: getImageUri(m.IMAGES_3)
            }
        }))
         res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_CODES.OK,
            message: "Liste des  menu restaurants",
            result: menus

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
};
const  getmenubyIdPartenaire = async (req, res) => {
    try {
        const { ID_PARTENAIRE } = req.params
        const menu = await restoMenuModel.findmenubyPartenaire(ID_PARTENAIRE)
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_CODES.OK,
            message: "Liste des  menu restaurants du partenaire",
            result: menu


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
    getAllCategories,
    getSousCategories,
    getmenu,
    getmenubyIdPartenaire
}