const menuModel = require('../models/restaurent.menu.model')
const Validation = require('../class/Validation')
const jwt = require("jsonwebtoken");
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const generateToken = require('../utils/generateToken');
const path = require("path");
const MenuUpload = require("../class/uploads/MenuUpload");
const { query } = require('../utils/db');
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
                IMAGE_2: {
                    image: 21000000
                },
                IMAGE_3: {
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
                IMAGE_2: {
                    image: "Veuillez choisir une image valide",
                    size: "L'image est trop volumineux"
                },
                IMAGE_3: {
                    image: "Veuillez choisir une image valide",
                    size: "L'image est trop volumineux"
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
        var filename_2
        var filename_3
        const { fileInfo: fileInfo_1, thumbInfo: thumbInfo_1 } = await menuUpload.upload(IMAGE_1, false)
        if(IMAGE_2){
            const { fileInfo: fileInfo_2, thumbInfo: thumbInfo_2 } = await menuUpload.upload(IMAGE_2, false)
            filename_2 = fileInfo_2.fileName
        } 
        if(IMAGE_3){
            const { fileInfo: fileInfo_3, thumbInfo: thumbInfo_3 } = await menuUpload.upload(IMAGE_3, false)
            filename_3 = fileInfo_3.fileName
        }
        const { insertId } = await menuModel.createMenuTaille(
            ID_CATEGORIE_MENU,
            QUANTITE,
            DESCRIPTION,
            ID_UNITE
        );

        const { insertId: id_menu } = await menuModel.createMenu(
            ID_CATEGORIE_MENU,
            ID_SOUS_CATEGORIE_MENU,
            ID_SOUS_SOUS_CATEGORIE,
            ID_REPAS,
            2,
            insertId,
            fileInfo_1.fileName,
            filename_2 ? filename_2 : null,
            filename_3 ? filename_3 : null,
            2,
        )

        const { insertId:id_repas } = await menuModel.createRepas(
            2,
            2,
            DESCRIPTION_REPAS,
            DESCRIPTION_FOURNISSEUR
        );

        const { insertId: id_prix_categorie} = await menuModel.createMenuPrix(
            MONTANT,
            2,
            id_menu,
            3
        );

        const menu = (await menuModel.findById(insertId))[0]
        const allmenu = (await query("SELECT IMAGES_1,IMAGES_2 ,IMAGES_3 FROM restaurant_menu WHERE ID_RESTAURANT_MENU=" + menu.ID_RESTAURANT_MENU))[0]
        const categorie = (await query("SELECT NOM AS NOM_CATEGORIE,DESCRIPTION AS DESCRIPTION_MENU FROM restaurant_categorie_menu WHERE ID_CATEGORIE_MENU=" + menu.ID_CATEGORIE_MENU))[0]
        const Subcategorie = (await query("SELECT NOM AS NOM_SUB_CATEGORY, DESCRIPTION AS DESC_SUB_CSTEGORY FROM restaurant_sous_categorie_menu WHERE ID_SOUS_CATEGORIE_MENU=" + menu.ID_SOUS_CATEGORIE_MENU))[0]
        const SubSubcategorie = (await query("SELECT DESCRIPTION FROM restaurant_sous_sous_categorie WHERE ID_SOUS_SOUS_CATEGORIE=" + menu.ID_SOUS_SOUS_CATEGORIE))[0]
        const repas = (await query("SELECT DESCRIPTION AS NOM_REPAS, DESCRIPTION_FOURNISSEUR AS DESCR_REPAS FROM restaurant_repas WHERE ID_REPAS=" + menu.ID_REPAS))[0]
        const partenaire = (await query("SELECT NOM_ORGANISATION FROM partenaires WHERE ID_PARTENAIRE=" + menu.ID_PARTENAIRE))[0]
        const unites = (await query("SELECT UNITES_MESURES FROM restaurant_menu_unite WHERE ID_UNITE=" + menu.ID_UNITE))[0]
        const prix = (await query("SELECT MONTANT FROM restaurant_menu_prix WHERE ID_PRIX_CATEGORIE=" + menu.ID_PRIX_CATEGORIE))[0]

        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/menu/${fileName}`
        }
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Enregistrement est fait avec succès",
            result: {
                ...menu,
                IMAGES_1:getImageUri(menu.IMAGES_1),
                IMAGES_2:getImageUri(menu.IMAGES_2),
                IMAGES_3:getImageUri(menu.IMAGES_3),
                allmenu:allmenu,
                categorie:categorie,
                Subcategorie:Subcategorie,
                SubSubcategorie:SubSubcategorie,
                repas:repas,
                partenaire:partenaire,
                unites:unites,
                prix:prix
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