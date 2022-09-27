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
const getmenu = async (req, res) => {
    try {
        const { category } = req.query
        const menu = await restoMenuModel.findmenu(category)
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_CODES.OK,
            message: "Liste des  menu restaurants",
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
    getmenu
}