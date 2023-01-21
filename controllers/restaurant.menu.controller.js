const menuModel = require('../models/restaurent.menu.model')
const Validation = require('../class/Validation')
const jwt = require("jsonwebtoken");
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const generateToken = require('../utils/generateToken');
const path = require("path");
const MenuUpload = require("../class/uploads/MenuUpload");
const { query } = require('../utils/db');
const ProductUpload = require('../class/uploads/ProductUpload');
const IMAGES_DESTINATIONS = require('../constants/IMAGES_DESTINATIONS');
// const createMenu = async (req, res) => {
//     try {
//         const {
//             ID_CATEGORIE_MENU,
//             ID_REPAS,
//             NOM_REPAS,
//             ID_SOUS_CATEGORIE_MENU,
//             ID_PARTENAIRE_SERVICE,
//             NOM_MENU,
//             TEMPS_PREPARATION,
//             PRIX,
//             DESCRIPT,
//             DESCRIPTIONrepas,
//             DESCRIPTIONmenu,
//         } = req.body
//         console.log(req.body)
//         const { IMAGE_1, IMAGE_2, IMAGE_3 } = req.files || {}
//         const validation = new Validation(
//             { ...req.body, ...req.files },
//             {
//                 IMAGE_1: {
//                     required: true,
//                     image: 21000000
//                 },
//                 IMAGE_2: {
//                     image: 21000000
//                 },
//                 IMAGE_3: {
//                     image: 21000000
//                 },
//                 ID_CATEGORIE_MENU:
//                 {
//                     exists: "restaurant_categorie_menu,ID_CATEGORIE_MENU",
//                 },
//                 // ID_REPAS:
//                 // {
//                 //           exists: "restaurant_categorie_menu,ID_CATEGORIE_MENU",
//                 // },
//             },
//             {
//                 IMAGE_1: {
//                     required: "Image d'un produit est obligatoire",
//                     image: "taille invalide"
//                 },
//                 IMAGE_2: {
//                     image: "Veuillez choisir une image valide",
//                     size: "L'image est trop volumineux"
//                 },
//                 IMAGE_3: {
//                     image: "Veuillez choisir une image valide",
//                     size: "L'image est trop volumineux"
//                 },

//                 ID_CATEGORIE_MENU:
//                 {
//                     exists: "categorie invalide",
//                 },
//             }
//         );
//         await validation.run();
//         const isValide = await validation.isValidate()
//         const errors = await validation.getErrors()
//         if (!isValide) {
//             return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
//                 statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
//                 httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
//                 message: "Probleme de validation des donnees",
//                 result: errors
//             })
//         }
//         const menuUpload = new MenuUpload()
//         var filename_1
//         var filename_2
//         var filename_3
//         if (IMAGE_1) {
//             const { fileInfo: fileInfo_1, thumbInfo: thumbInfo_1 } = await menuUpload.upload(IMAGE_1, false)
//             filename_1 = fileInfo_1.fileName
//         }
//         if (IMAGE_2) {
//             const { fileInfo: fileInfo_2, thumbInfo: thumbInfo_2 } = await menuUpload.upload(IMAGE_2, false)
//             filename_2 = fileInfo_2.fileName
//         }
//         if (IMAGE_3) {
//             const { fileInfo: fileInfo_3, thumbInfo: thumbInfo_3 } = await menuUpload.upload(IMAGE_3, false)
//             filename_3 = fileInfo_3.fileName
//         }

//         var Repas = 0
//         if (NOM_REPAS) {
//             const { insertId: repas } = await query("INSERT INTO  restaurant_repas (NOM,DESCRIPTION) VALUES (?,?)", [NOM_REPAS, DESCRIPTIONrepas])
//             const { insertId: idmenu } = await menuModel.createMenu(
//                 repas,
//                 ID_CATEGORIE_MENU,
//                 ID_SOUS_CATEGORIE_MENU,
//                 ID_PARTENAIRE_SERVICE,
//                 PRIX,
//                 TEMPS_PREPARATION,
//                 DESCRIPTIONmenu,
//                 filename_1 ? filename_1 : null,
//                 filename_2 ? filename_2 : null,
//                 filename_3 ? filename_3 : null,
//             );
//             const menu = (await menuModel.findById(idmenu))[0]
//             const getImageUri = (fileName) => {
//                 if (!fileName) return null
//                 if (fileName.indexOf("http") === 0) return fileName
//                 return `${req.protocol}://${req.get("host")}/uploads/menu/${fileName}`
//             }
//             res.status(RESPONSE_CODES.CREATED).json({
//                 statusCode: RESPONSE_CODES.CREATED,
//                 httpStatus: RESPONSE_STATUS.CREATED,
//                 message: "Enregistrement est fait avec succès",
//                 result: {
//                     ...menu,
//                     IMAGES_1: getImageUri(menu.IMAGES_1),
//                     IMAGES_2: getImageUri(menu.IMAGES_2),
//                     IMAGES_3: getImageUri(menu.IMAGES_3),
//                 }
//             })



//         }
//         else {
//             const { insertId } = await menuModel.createMenu(
//                 ID_REPAS,
//                 ID_CATEGORIE_MENU,
//                 ID_SOUS_CATEGORIE_MENU,
//                 ID_PARTENAIRE_SERVICE,
//                 PRIX,
//                 TEMPS_PREPARATION,
//                 DESCRIPTIONmenu,
//                 filename_1 ? filename_1 : null,
//                 filename_2 ? filename_2 : null,
//                 filename_3 ? filename_3 : null,
//             );
//             const menu = (await menuModel.findById(insertId))[0]
//             const getImageUri = (fileName) => {
//                 if (!fileName) return null
//                 if (fileName.indexOf("http") === 0) return fileName
//                 return `${req.protocol}://${req.get("host")}/uploads/menu/${fileName}`
//             }
//             res.status(RESPONSE_CODES.CREATED).json({
//                 statusCode: RESPONSE_CODES.CREATED,
//                 httpStatus: RESPONSE_STATUS.CREATED,
//                 message: "Enregistrement est fait avec succès",
//                 result: {
//                     ...menu,
//                     IMAGES_1: getImageUri(menu.IMAGES_1),
//                     IMAGES_2: getImageUri(menu.IMAGES_2),
//                     IMAGES_3: getImageUri(menu.IMAGES_3),
//                 }
//             })
//         }
//     }
//     catch (error) {
//         console.log(error)
//         res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
//             statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
//             httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
//             message: "Enregistrement echoue",

//         })
//     }
// }

const createProduit = async (req, res) => {
    try {
        const {
            ID_REPAS,
            ID_CATEGORIE_MENU,
            ID_PARTENAIRE_SERVICE,
            PRIX,
            DESCRIPTION,
            variants: varStr,
            inventories: invStr
        } = req.body

        var variants, inventories
        if (varStr) variants = JSON.parse(varStr)
        if (invStr) inventories = JSON.parse(invStr)
        const { IMAGE_1, IMAGE_2, IMAGE_3 } = req.files || {}
        const validation = new Validation(
            { ...req.body, ...req.files },
            {
                IMAGE_1: {
                    required: true,
                    image: 21000000
                },
                ID_CATEGORIE_MENU: {
                    required: true
                },
                IMAGE_2: {
                    image: 21000000
                },
                IMAGE_3: {
                    image: 21000000
                },
                NOM: {
                    required: true,
                    length: [1, 100],
                },
                DESCRIPTION: {
                    length: [1, 3000],
                },
                PRIX: {
                    required: true,
                },
            },
            {
                IMAGE_1: {
                    required: "Image d'un produit est obligatoire",
                    image: "Veuillez choisir une image valide",
                    size: "L'image est trop volumineux"
                },
                IMAGE_2: {
                    image: "Veuillez choisir une image valide",
                    size: "L'image est trop volumineux"
                },
                IMAGE_3: {
                    image: "Veuillez choisir une image valide",
                    size: "L'image est trop volumineux"
                },
                ID_CATEGORIE_MENU: {
                    exists: "categorie invalide",
                },
                
                NOM: {
                    required: "nom du produit  est obligatoire",
                    length: "Nom du produit invalide"
                },
                DESCRIPTION: {
                    required: "Vérifier la taille de votre description(max: 3000 caractères)",
                },
            }
        );
        await validation.run();
        const isValid = await validation.isValidate()
        const errors = await validation.getErrors()
        if (!isValid) {
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: "Probleme de validation des donnees",
                result: errors
            })
        }
        const productUpload = new ProductUpload()
        var filename_2
        var filename_3
        const { fileInfo: fileInfo_1, thumbInfo: thumbInfo_1 } = await productUpload.upload(IMAGE_1, false)
        if (IMAGE_2) {
            const { fileInfo: fileInfo_2, thumbInfo: thumbInfo_2 } = await productUpload.upload(IMAGE_2, false)
            filename_2 = fileInfo_2
        }
        if (IMAGE_3) {
            const { fileInfo: fileInfo_3, thumbInfo: thumbInfo_3 } = await productUpload.upload(IMAGE_3, false)
            filename_3 = fileInfo_3
        }
        const { insertId: ID_RESTAURANT_MENU } = await menuModel.createProduit(
            ID_REPAS,
            ID_CATEGORIE_MENU,
            ID_PARTENAIRE_SERVICE,
            PRIX,
            DESCRIPTION,

           `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.products}/${fileInfo_1.fileName}`,
            filename_2 ? `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.products}/${filename_2.fileName}` : null,
            filename_3 ? `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.products}/${filename_3.fileName}` : null
        )
        if (variants && variants.length > 0) {
            await Promise.all(variants.map(async variant => {
                const { insertId: ID_VARIANT } = await query('INSERT INTO restaurant_menu_variants(ID_RESTAURANT_MENU, FRONTEND_VARIANT_ID, VARIANT_NAME) VALUES(?, ?, ?)', [
                    ID_RESTAURANT_MENU, variant.id, variant.variantName
                ])
                const ecommerce_variant_values = []
                variant.options.forEach(option => {
                    ecommerce_variant_values.push([
                        ID_RESTAURANT_MENU,
                        ID_VARIANT,
                        option.id,
                        option.name
                    ])
                })
                if (ecommerce_variant_values.length > 0) {
                    await query('INSERT INTO restaurant_variant_values(ID_RESTAURANT_MENU, ID_VARIANT, FRONTEND_VALUE_ID, VALUE_NAME) VALUES ?', [ecommerce_variant_values])
                }
            }))
        }
        if (inventories && inventories.length > 0) {
            const ecommerce_variant_combination = []
            inventories.forEach(inventory => {
                ecommerce_variant_combination.push([ID_RESTAURANT_MENU, inventory.quantity, inventory.price, inventory.id])
            })
            if (ecommerce_variant_combination.length > 0) {
                await query('INSERT INTO restaurant_variant_combination(ID_RESTAURANT_MENU, QUANTITE, PRIX, FRONTEND_COMBINAISON_ID) VALUES ?', [ecommerce_variant_combination])
            }
            const newCombinaisons = await query('SELECT * FROM restaurant_variant_combination WHERE ID_RESTAURANT_MENU = ?', [ID_RESTAURANT_MENU])
            const values = await query('SELECT * FROM restaurant_variant_values WHERE ID_RESTAURANT_MENU = ?', [ID_RESTAURANT_MENU])
            var ecommerce_variant_combination_values = []
            newCombinaisons.forEach(combinaison => {
                const myInventory = inventories.find(inv => inv.id == combinaison.FRONTEND_COMBINAISON_ID)
                const itemsWithIds = myInventory.items.map(item => {
                    const myValue = values.find(val => val.FRONTEND_VALUE_ID == item.id)
                    return {
                        ...item,
                        ID_VALUE: myValue.ID_VALUE
                    }
                })
                itemsWithIds.forEach(item => {
                    ecommerce_variant_combination_values.push([combinaison.ID_COMBINATION, item.ID_VALUE])
                })
            })
            if (ecommerce_variant_combination_values.length > 0) {
                await query('INSERT INTO restaurant_variant_combination_values(ID_COMBINATION, ID_VALUE) VALUES ?', [ecommerce_variant_combination_values])
            }
            console.log({ ecommerce_variant_combination_values, length: ecommerce_variant_combination_values.length })
        }
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Enregistrement du produit est fait avec succès",
            result: {
                ID_RESTAURANT_MENU
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
        const { ID_TYPE_REPAS } = req.params
        const produits = await menuModel.findAllRepas(ID_TYPE_REPAS)
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
        const getImageUri = (fileName, folder) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/${folder}/${fileName}`
        }
        const categories = await menuModel.findAllCategories()
        const categoriess = categories.map(categorie => ({
            ...categorie,
            IMAGE: getImageUri(categorie.IMAGE, "menu"),
        }))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "succès categorie",
            result: categoriess
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
const getCategoriesById = async (req, res) => {
    try {
        const { ID_PARTENAIRE_SERVICE } = req.params
        const getImageUri = (fileName, folder) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/${folder}/${fileName}`
        }
        const categories = await menuModel.findAllCategoriesById(ID_PARTENAIRE_SERVICE)
        const categoriess = categories.map(categorie => ({
            ...categorie,
            IMAGE: getImageUri(categorie.IMAGE, "menu"),
        }))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "succès categorie",
            result: categoriess
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

const getTypesRepas = async (req, res) => {
    try {
        const TypesRepas = await menuModel.findAllTypesRepas()
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "succès",
            result: TypesRepas
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

const updateAllMenu = async (req, res) => {
    try {
        const {
            ID_CATEGORIE_MENU,
            ID_REPAS,
            NOM_REPAS,
            ID_SOUS_CATEGORIE_MENU,
            ID_PARTENAIRE_SERVICE,
            NOM_MENU,
            PRIX,
            DESCRIPT,
            DESCRIPTIONrepas,
            TEMPS_PREPARATION
        } = req.body
        const { ID_RESTAURANT_MENU } = req.params
        console.log(req.body)
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/menu/${fileName}`
        }

        if (NOM_REPAS) {
            const { insertId: repas } = await query("INSERT INTO  restaurant_repas (NOM,DESCRIPTION) VALUES (?,?)", [NOM_REPAS, DESCRIPTIONrepas])
            const { insertId: idmenu } = await menuModel.createMenuUpdate(
                repas,
                ID_CATEGORIE_MENU,
                ID_SOUS_CATEGORIE_MENU,
                ID_PARTENAIRE_SERVICE,
                PRIX,
                TEMPS_PREPARATION,
                DESCRIPT
            );
            const menu = (await menuModel.findById(idmenu))[0]

            res.status(RESPONSE_CODES.CREATED).json({
                statusCode: RESPONSE_CODES.CREATED,
                httpStatus: RESPONSE_STATUS.CREATED,
                message: "update de nouveau menu est fait avec succès",
                result: menu
            })

        }
        else {
            const { insertId } = await menuModel.updateMenuRestaurant(
                ID_RESTAURANT_MENU,
                ID_REPAS,
                ID_CATEGORIE_MENU,
                ID_SOUS_CATEGORIE_MENU,
                ID_PARTENAIRE_SERVICE,
                PRIX,
                TEMPS_PREPARATION,
                DESCRIPT
            );
            // const menuUpdate = (await menuModel.findMenuById(ID_RESTAURANT_MENU))[0]
            const menuUpdate = (await query("SELECT * FROM restaurant_menus WHERE ID_RESTAURANT_MENU=? ", [ID_RESTAURANT_MENU]))[0]
            const menus = {
                ...menuUpdate,
                IMAGE: getImageUri(menuUpdate.IMAGES_1),
                IMAGES_2: getImageUri(menuUpdate.IMAGES_2),
                IMAGES_3: getImageUri(menuUpdate.IMAGES_3),
            }
            res.status(RESPONSE_CODES.CREATED).json({
                statusCode: RESPONSE_CODES.CREATED,
                httpStatus: RESPONSE_STATUS.CREATED,
                message: "Update est fait avec succès",
                menus
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Update echoue",

        })
    }
}


module.exports = {
   //createMenu,
    findByInsertId,
    getRepas,
    getCategories,
    getSousCategories,
    getSousSousCategories,
    getUnites,
    getTypesRepas,
    findByInsertId,
    updateAllMenu,
    getCategoriesById,
    createProduit
}