const menuModel = require('../models/restaurent.menu.model')
const Validation = require('../class/Validation')
const jwt = require("jsonwebtoken");
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const generateToken = require('../utils/generateToken');
const path = require("path");
const MenuUpload = require("../class/uploads/MenuUpload")
const createMenu = async (req, res) => {
    try {
        const {
            ID_CATEGORIE_MENU,
            ID_SOUS_CATEGORIE_MENU,
            ID_SOUS_SOUS_CATEGORIE,
            ID_REPAS,
            ID_PARTENAIRE,
            DESCRIPTION_REPAS,
            DESCRIPTION_FOURNISSEUR,
            QUANTITE,
            DESCRIPTION,
            MONTANT,
            ID_UNITE
        } = req.body
        const { IMAGE_1, IMAGE_2, IMAGE_3 } = req.files || {}
        const validation = new Validation(
            { ...req.body, ...req.files },
            {
                IMAGE_1: {
                    required: true,
                    image: 21000000
                },
                ID_CATEGORIE_MENU:
                {
                    exists: "restaurant_categorie_menu,ID_CATEGORIE_MENU",
                },
            },
            {
                IMAGE_1: {
                    required: "Image d'un produit est obligatoire",
                    image: "taille invalide"
                },

                ID_CATEGORIE_MENU:
                {
                    exists: "categorie invalide",
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
        const menuUpload = new MenuUpload()
        const { fileInfo: fileInfo_1, thumbInfo: thumbInfo_1 } = await menuUpload.upload(IMAGE_1, false)
        const { fileInfo: fileInfo_2, thumbInfo: thumbInfo_2 } = await menuUpload.upload(IMAGE_2, false)
        const { fileInfo: fileInfo_3, thumbInfo: thumbInfo_3 } = await menuUpload.upload(IMAGE_3, false)
        const { insertId } = await menuModel.createMenu(
            ID_CATEGORIE_MENU,
            ID_SOUS_CATEGORIE_MENU,
            ID_SOUS_SOUS_CATEGORIE,
            ID_REPAS,
            ID_PARTENAIRE,
            fileInfo_1.fileName,
            fileInfo_2.fileName,
            fileInfo_3.fileName,
            req.userId,
        )

        const { insertId:id_repas } = await menuModel.createRepas(
            2,
            2,
            DESCRIPTION_REPAS,
            DESCRIPTION_FOURNISSEUR
        );

        const { insertId:id_menu_taille } = await menuModel.createMenuTaille(
            ID_CATEGORIE_MENU,
            QUANTITE,
            DESCRIPTION,
            ID_UNITE
        );

        const { insertId: id_prix_categorie} = await menuModel.createMenuPrix(
            MONTANT,
            2,
            insertId,
            2
        );


        const menu = (await menuModel.findById(insertId))[0]

        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Enregistrement est fait avec succès",
            result: menu
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
const findByInsertId = async (req, res) => {
    const { id } = req.params
    try {
        const service = await menuModel.findById(id)
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "succès",
            result: service
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

const getRepas = async (req, res) => {
    try {
        const produits = await menuModel.findAllRepas()
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

const getCategories = async (req, res) => {
    try {
        const categories = await menuModel.findAllCategories()
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "succès",
            result: categories
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

const getSousCategories = async (req, res) => {
    try {
        const Souscategories = await menuModel.findAllSousCategories()
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "succès",
            result: Souscategories
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

const getSousSousCategories = async (req, res) => {
    try {
        const SousSouscategories = await menuModel.findAllSousSousCategories()
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "succès",
            result: SousSouscategories
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

const getUnites = async (req, res) => {
    try {
        const unites = await menuModel.findAllUnites()
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "succès",
            result: unites
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
    createMenu,
    findByInsertId,
    getRepas,
    getCategories,
    getSousCategories,
    getSousSousCategories,
    getUnites

}