const RESPONSE_CODES = require('../constants/RESPONSE_CODES')
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS')
const restoMenuModel = require('../models/resto.menu.model')
const jwt = require("jsonwebtoken");
const Validation = require('../class/Validation');
const MenuUpload = require('../class/uploads/MenuUpload');
const { query } = require('../utils/db');
const getAllCategories = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/menu/${fileName}`
        }
        const menucategories = await restoMenuModel.findmenucategories()
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_CODES.OK,
            message: "Liste des menucategories",
            result: menucategories,

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
const getnote = async (req, res) => {
    try {


        const { ID_RESTAURANT_MENU } = req.params

        const noteListe = await restoMenuModel.findnotemenu(ID_RESTAURANT_MENU, req.userId)

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
const getByIdCategories = async (req, res) => {
    try {
        const { ID_PARTENAIRE_SERVICE } = req.params
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/menu/${fileName}`
        }
        const menucategories = await restoMenuModel.findCategories(ID_PARTENAIRE_SERVICE)
        const categoriess = menucategories.map(categorie => ({
            ...categorie,
            IMAGE: getImageUri(categorie.IMAGE, "menu"),
        }))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_CODES.OK,
            message: "Liste des menu categories",
            result: categoriess


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
        const notes = {
            restaurant_note: {
                NOTE: note.NOTE,
                COMENTAIRE: note.COMMENTAIRE,
                DATE: note.DATE_INSERTION,
                ID_RESTAURANT_MENU: note.ID_RESTAURANT_MENU
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
        console.log(notes)


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
const getAllNotes = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }

        const { ID_RESTAURANT_MENU, limit, offset } = req.params

        const noteListe = await restoMenuModel.findBYidProduitPartenaire(ID_RESTAURANT_MENU, limit, offset)
        const notes = noteListe.map(note => ({
            restaurant_note: {
                NOTE: note.NOTE,
                COMENTAIRE: note.COMMENTAIRE,
                DATE: note.DATE_INSERTION,
                ID_RESTAURANT_MENU: note.ID_RESTAURANT_MENU
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
        const { ID_PARTENAIRE_SERVICE } = req.params

        // const {ID_USER}=req.userId
        // console.log(ID_USER)
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/menu/${fileName}`
        }
        const { partenaire, category } = req.query
        var menu = await restoMenuModel.findmenu(req.userId, ID_PARTENAIRE_SERVICE)
        const menus = await Promise.all(menu.map(async m => {
            const NbreCommande = (await query('SELECT COUNT(ID_RESTAURANT_MENU) AS nbr  FROM restaurant_commandes WHERE ID_RESTAURANT_MENU=? GROUP BY  ID_RESTAURANT_MENU', [m.ID_RESTAURANT_MENU]))[0]
            const NbreLike = (await query('SELECT COUNT(ID_RESTAURANT_MENU) AS nbr  FROM restaurant_wishlist_menu WHERE ID_RESTAURANT_MENU=? GROUP BY  ID_RESTAURANT_MENU', [m.ID_RESTAURANT_MENU]))[0]
            return {
                ...m,
                NbreLike: NbreLike,
                NbreCommande: NbreCommande,
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
const updateMenu = async (req, res) => {

    try {
        const { ID_RESTAURANT_MENU } = req.params
        const {
            REPAS, CATEGORIE, PRIX, TEMPS, DESCRIPTION
        } = req.body
        const partenaires = await query("UPDATE restaurant_menus SET ID_REPAS=?,ID_CATEGORIE_MENU=?,PRIX=?,TEMPS_PREPARATION=?,DESCRIPTION=? WHERE ID_RESTAURANT_MENU=?", [REPAS, CATEGORIE, PRIX, TEMPS, DESCRIPTION, ID_RESTAURANT_MENU]);
        const menuUpdate = (await query("SELECT  rm.*,rr.ID_REPAS,rr.NOM as repas,rcm.ID_CATEGORIE_MENU,rcm.NOM as categorie FROM restaurant_menus rm LEFT JOIN restaurant_repas rr ON rr.ID_REPAS=rm.ID_REPAS LEFT JOIN restaurant_categorie_menu rcm ON rcm.ID_CATEGORIE_MENU=rm.ID_CATEGORIE_MENU WHERE ID_RESTAURANT_MENU=?", [ID_RESTAURANT_MENU]))[0]
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_CODES.OK,
            message: "Liste des  menu restaurants",
            result: menuUpdate

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
const DeleteMenu = async (req, res) => {

    try {
        const { ID_RESTAURANT_MENU } = req.params
        const deleteRow = (await query('DELETE FROM  restaurant_menus WHERE ID_RESTAURANT_MENU=? ', [ID_RESTAURANT_MENU]))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_CODES.OK,
            message: "Suppression reussi",
            // result: menus

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
        const { ID_RESTAURANT_MENU } = req.params

        const NbreCommande = (await query('SELECT COUNT(ID_RESTAURANT_MENU) AS nbr  FROM restaurant_commandes WHERE ID_RESTAURANT_MENU=? GROUP BY  ID_RESTAURANT_MENU', [m.ID_RESTAURANT_MENU]))[0]


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
        const { q, category, limit, offset } = req.query
        var menu = await restoMenuModel.findAllmenu(q, category, limit, offset)
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
const getmenuResearch = async (req, res) => {
    try {
        const { ID_RESTAURANT_MENU } = req.params
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/menu/${fileName}`
        }
        const { q, limit, offset } = req.query
        var menu = await restoMenuModel.findmenuResearch(q, limit, offset, ID_RESTAURANT_MENU)
        const menus = await Promise.all(menu.map(async m => {
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
            // message: "liste menus restaurants par repport au restaurant",
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
const getmenubyIdPartenaire = async (req, res) => {
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
        var menu = await restoMenuModel.findWishlist(req.userId, category, limit, offset)
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

const upadtePhotoMenu = async (req, res) => {
    try {
        const { ID_RESTAURANT_MENU } = req.params
        const { IMAGE } = req.files || {}
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/menu/${fileName}`
        }
        const menuUpload = new MenuUpload()
        const { fileInfo, thumbInfo } = await menuUpload.upload(IMAGE, false)
        const { insertId: insertMenu } = await restoMenuModel.updateMenu(
            fileInfo.fileName,
            ID_RESTAURANT_MENU,
        )
        const menuUpdate = await query("SELECT * FROM restaurant_menus WHERE ID_RESTAURANT_MENU=? ", [ID_RESTAURANT_MENU])
        const menus = menuUpdate.map(menu => ({
            ...menu,
            IMAGE: getImageUri(menu.IMAGES_1),
        }))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_CODES.OK,
            message: "Update des menu est faites avec succes",
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
}

const upadteAllDescription = async (req, res) => {
    try {
        const { ID_RESTAURANT_MENU } = req.params
        const { insertId: insertMenu } = await restoMenuModel.updateMenu(
            fileInfo.fileName,
            ID_RESTAURANT_MENU,
        )
        const menuUpdate = await query("SELECT * FROM restaurant_menus WHERE ID_RESTAURANT_MENU=? ", [ID_RESTAURANT_MENU])
        const menus = menuUpdate.map(menu => ({
            ...menu,
            IMAGE: getImageUri(menu.IMAGES_1),
        }))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_CODES.OK,
            message: "Update des menu est faites avec succes",
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
}


module.exports = {
    getAllCategories,
    getSousCategories,
    getmenu,
    getAllmenu,
    getmenuResearch,
    getmenubyIdPartenaire,
    getByIdCategories,
    getByIdmenu,
    getWishlist,
    insertNote,
    getAllNotes,
    getnote,
    upadtePhotoMenu,
    updateMenu,
    DeleteMenu,
    upadteAllDescription
}