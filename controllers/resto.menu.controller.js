const RESPONSE_CODES = require('../constants/RESPONSE_CODES')
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS')
const restoMenuModel = require('../models/resto.menu.model')
const jwt = require("jsonwebtoken");
const Validation = require('../class/Validation')
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
const getByIdCategories = async (req, res) => {
    try {
        const {ID_PARTENAIRE_SERVICE}=req.params
        const menucategories = await restoMenuModel.findCategories(ID_PARTENAIRE_SERVICE)
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_CODES.OK,
            message: "Liste des menu categories",
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

const insertNote = async (req, res) => {

    try {


        const { ID_RESTAURANT_MENU, NOTE, COMMENTAIRE } = req.body
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



        const { insertId } = await restoMenuModel.createNotes(
            req.userId,
            ID_RESTAURANT_MENU,
            NOTE,
            COMMENTAIRE,

        )
        const note = (await restoMenuModel.findById(insertId))[0]
        
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "le commentaire",
            result: note


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
        const {ID_PARTENAIRE_SERVICE}=req.params
        // const {ID_USER}=req.userId
        // console.log(ID_USER)
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/menu/${fileName}`
        }
        const { partenaire,category } = req.query
        var menu = await restoMenuModel.findmenu(req.userId,ID_PARTENAIRE_SERVICE)
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
const getByIdmenu = async (req, res) => {
   
    try {
        const {ID_PARTENAIRE_SERVICE}=req.params
        // const {ID_USER}=req.userId
        // console.log(ID_USER)
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/menu/${fileName}`
        }
        const { category, limit, offset } = req.query
        var menu = await restoMenuModel.findByIDmenu(ID_PARTENAIRE_SERVICE,category, limit, offset)
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
const getAllmenu = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/menu/${fileName}`
        }
        const { category, limit, offset } = req.query
        var menu = await restoMenuModel.findAllmenu(category, limit, offset )
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
const getWishlist = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/menu/${fileName}`
        }
        const { category, limit, offset } = req.query
        var menu = await restoMenuModel.findWishlist(req.userId,category, limit, offset )
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
module.exports = {
    getAllCategories,
    getSousCategories,
    getmenu,
    getAllmenu,
    getmenubyIdPartenaire,
    getByIdCategories,
    getByIdmenu,
    getWishlist,
    insertNote

}