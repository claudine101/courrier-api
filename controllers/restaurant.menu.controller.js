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
            ID_ROPAS,
            ID_PARTENAIRE,
            // ID_TAILLE,
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
                    required: true,
                    image: 21000000
                },
                IMAGE_3: {
                    required: true,
                    image: 21000000
                },
                ID_CATEGORIE_MENU:
                {
                    exists: "restaurant_categorie_menu,ID_CATEGORIE_MENU",
                },
                ID_SOUS_SOUS_CATEGORIE:
                {
                    exists: "restaurant_sous_categorie_menu,ID_SOUS_SOUS_CATEGORIE",
                },
               
                ID_ROPAS:{
                    exists: "restaurant_repas,ID_REPAS",
                },
                ID_PARTENAIRE:{
                    exists: "partenaires,ID_PARTENAIRE",
                },
                // ID_TAILLE:{
                //     exists: "restaurant_sous_categorie_menu,ID_TAILLE",
                // },


            },
            {
                IMAGE_1: {
                    required: "Image d'un produit est obligatoire",
                    image: "taille invalide"
                },
                IMAGE_2: {
                    required: "Image d'un produit est obligatoire",
                    image: "taille invalide"
                },
                IMAGE_3: {
                    required: "Image d'un produit est obligatoire",
                    image: "taille invalide"
                },
                ID_CATEGORIE_MENU:
                {
                    exists: "categorie invalide",
                },
                ID_SOUS_SOUS_CATEGORIE:
                {
                    exists: "sous categorie invalide",
                },
                ID_ROPAS:{
                    exists: "repas  invalide",
                },
                ID_PARTENAIRE:{
                    exists: "partenaire invalide",
                },
                ID_TAILLE:{
                    exists: "taille invalide",
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
                    const { fileInfo:fileInfo_1,thumbInfo:thumbInfo_1 } = await menuUpload.upload(IMAGE_1, false)
                    const { fileInfo:fileInfo_2 ,thumbInfo:thumbInfo_2} = await menuUpload.upload(IMAGE_2, false)
                    const { fileInfo:fileInfo_3,thumbInfo:thumbInfo_3} = await menuUpload.upload(IMAGE_3, false)

        const { insertId} = await menuModel.createMenu(

            ID_CATEGORIE_MENU,
            ID_SOUS_CATEGORIE_MENU,
            ID_SOUS_SOUS_CATEGORIE,
            ID_ROPAS,
            ID_PARTENAIRE,
            ID_TAILLE,
            fileInfo_1.fileName,
            fileInfo_2.fileName,
            fileInfo_3.fileName,
            req.userId,
            
            
        )
  
      
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

module.exports = {
    createMenu,
    findByInsertId,

}