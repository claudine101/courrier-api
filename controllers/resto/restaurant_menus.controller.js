const ProductUpload = require("../../class/uploads/ProductUpload");
const Validation = require("../../class/Validation");
const IMAGES_DESTINATIONS = require("../../constants/IMAGES_DESTINATIONS");
const RESPONSE_CODES = require("../../constants/RESPONSE_CODES");
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS");
const restaurant_menus_model = require("../../models/resto/restaurant_menus.model");
const { query } = require("../../utils/db");

const getAllmenu = async (req, res) => {
          try {
                    const { q, category, subCategory, partenaireService, limit, offset } = req.query
                    var Allmenus = await restaurant_menus_model.findAllmenu(q, category, subCategory, partenaireService, limit, offset,req.userId)
                    const menus = Allmenus.map(menu => {
                              return {
                                        produit: {
                                                  ID_RESTAURANT_MENU: menu.ID_RESTAURANT_MENU,
                                                  NOM: menu.NOM,
                                                  ID_PARTENAIRE_SERVICE: menu.ID_PARTENAIRE_SERVICE,
                                                  IMAGE: menu.IMAGE_1,
                                                  ID_WISHLIST:menu.ID_WISHLIST
                                        },
                                        partenaire: {
                                                  NOM_ORGANISATION: menu.NOM_ORGANISATION,
                                                  ID_PARTENAIRE: menu.ID_PARTENAIRE,
                                                  ID_TYPE_PARTENAIRE: menu.ID_TYPE_PARTENAIRE,
                                                  NOM: menu.NOM_USER,
                                                  PRENOM: menu.PRENOM,
                                                  ADRESSE_COMPLETE: menu.ADRESSE_COMPLETE,
                                                  ID_SERVICE: menu.ID_SERVICE,
                                                  LOGO: menu.LOGO,
                                                  BACKGROUND_IMAGE: menu.BACKGROUND_IMAGE,
                                                  EMAIL: menu.EMAIL,
                                                  TELEPHONE: menu.TELEPHONE,
                                                  ID_PARTENAIRE_SERVICE: menu.ID_PARTENAIRE_SERVICE,
                                        },
                                        produit_partenaire: {
                                                  ID_PARTENAIRE_SERVICE: menu.ID_PARTENAIRE_SERVICE,
                                                  NOM_ORGANISATION: menu.NOM_ORGANISATION,
                                                  NOM: menu.NOM_PRODUIT_PARTENAIRE,
                                                  DESCRIPTION: menu.DESCRIPTION,
                                                  IMAGE_1: menu.IMAGE_1,
                                                  IMAGE_2: menu.IMAGE_2,
                                                  IMAGE_3: menu.IMAGE_3,
                                                  TAILLE: menu.NOM_TAILLE,
                                                  PRIX: menu.PRIX
                                        },
                                        categorie: {
                                                  ID_CATEGORIE_MENU: menu.ID_CATEGORIE_MENU,
                                                  NOM: menu.NOM_CATEGORIE
                                        },
                              }
                    })
                    res.status(RESPONSE_CODES.OK).json({
                              statusCode: RESPONSE_CODES.OK,
                              httpStatus: RESPONSE_CODES.OK,
                              message: "Liste des  menus restaurants",
                              result: menus
                    })
          } catch (error) {
                    console.log(error)
                    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                              statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                              httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                              message: "Erreur interne du serveur, réessayer plus tard",
                    })
          }
};
const deleteNote= async (req, res) => {
    try {
        const {ID_NOTE}=req.params
         await query('DELETE FROM  restaurant_menus_notes WHERE ID_NOTE=?', [ID_NOTE])
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Suppression avec success",
        })
    } catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        })
    }
}
const WishlistMenu= async (req, res) => {
    try {
              const {limit, offset } = req.query
              var Wishlistmenus = await restaurant_menus_model.findwishlistmenu(limit, offset,req.userId)
              const menus = Wishlistmenus.map(menu => {
                        return {
                                  produit: {
                                            ID_RESTAURANT_MENU: menu.ID_RESTAURANT_MENU,
                                            NOM: menu.NOM,
                                            ID_PARTENAIRE_SERVICE: menu.ID_PARTENAIRE_SERVICE,
                                            IMAGE: menu.IMAGE_1,
                                            ID_WISHLIST:menu.ID_WISHLIST
                                  },
                                  partenaire: {
                                            NOM_ORGANISATION: menu.NOM_ORGANISATION,
                                            ID_PARTENAIRE: menu.ID_PARTENAIRE,
                                            ID_TYPE_PARTENAIRE: menu.ID_TYPE_PARTENAIRE,
                                            NOM: menu.NOM_USER,
                                            PRENOM: menu.PRENOM,
                                            ADRESSE_COMPLETE: menu.ADRESSE_COMPLETE,
                                            ID_SERVICE: menu.ID_SERVICE,
                                            LOGO: menu.LOGO,
                                            BACKGROUND_IMAGE: menu.BACKGROUND_IMAGE,
                                            EMAIL: menu.EMAIL,
                                            TELEPHONE: menu.TELEPHONE,
                                            ID_PARTENAIRE_SERVICE: menu.ID_PARTENAIRE_SERVICE,
                                  },
                                  produit_partenaire: {
                                            ID_PARTENAIRE_SERVICE: menu.ID_PARTENAIRE_SERVICE,
                                            NOM_ORGANISATION: menu.NOM_ORGANISATION,
                                            NOM: menu.NOM_PRODUIT_PARTENAIRE,
                                            DESCRIPTION: menu.DESCRIPTION,
                                            IMAGE_1: menu.IMAGE_1,
                                            IMAGE_2: menu.IMAGE_2,
                                            IMAGE_3: menu.IMAGE_3,
                                            TAILLE: menu.NOM_TAILLE,
                                            PRIX: menu.PRIX
                                  },
                                  categorie: {
                                            ID_CATEGORIE_MENU: menu.ID_CATEGORIE_MENU,
                                            NOM: menu.NOM_CATEGORIE
                                  },
                        }
              })
              res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_CODES.OK,
                        message: "Liste des  menus restaurants",
                        result: menus
              })
    } catch (error) {
              console.log(error)
              res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                        statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                        httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                        message: "Erreur interne du serveur, réessayer plus tard",
              })
    }
};
const getnotesMenus = async (req, res) => {
    try {
        
        const {ID_RESTAURANT_MENU,limit, offset } = req.query
        const notes = await restaurant_menus_model.findNotes(ID_RESTAURANT_MENU,limit, offset)
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des notes et commentaires",
            result: notes
        })
    } catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        })
    }
}
const getuserNotes = async (req, res) => {
    try {
        const { ID_RESTAURANT_MENU } = req.query
        const notes = (await restaurant_menus_model.finduserNotes(req.userId,ID_RESTAURANT_MENU))[0]
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste des notes et commentaires",
            result: notes
        })
    } catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        })
    }
}
const updateNote = async (req, res) => {
    try {
        const {ID_NOTE}=req.params
        const { NOTE,COMMENTAIRE } = req.body
       const { insertId } = await restaurant_menus_model.changeNote(NOTE,COMMENTAIRE,ID_NOTE
        )
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Modification avec success",
        })
    } catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        })
    }
}
const createRestaurant_wishlist_menu = async (req, res) => {
    try {

        const { ID_RESTAURANT_MENU } = req.params
        const wishlist = (await query('SELECT * FROM restaurant_wishlist_menu WHERE ID_USER=? AND ID_RESTAURANT_MENU=?', [req.userId,ID_RESTAURANT_MENU]))[0]
    
        if (wishlist) {
            await query('DELETE FROM  restaurant_wishlist_menu WHERE  ID_RESTAURANT_MENU=? AND ID_USER=? ', [ID_RESTAURANT_MENU, req.userId])
            res.status(RESPONSE_CODES.CREATED).json({
                statusCode: RESPONSE_CODES.CREATED,
                httpStatus: RESPONSE_STATUS.CREATED,
                message: "La suppression du wishlist",

            })

        } else {
            const { insertId } = await restaurant_menus_model.createwishlist(
                ID_RESTAURANT_MENU,
                req.userId
            )
            res.status(RESPONSE_CODES.CREATED).json({
                statusCode: RESPONSE_CODES.CREATED,
                httpStatus: RESPONSE_STATUS.CREATED,
                message: "Enregistrement est fait avec succès",
            })
        }


    } catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard",
        })
    }
}

const getCategories = async (req, res) => {
          try {
                    const categories = await query('SELECT * FROM restaurant_categorie_menu')
                    res.status(RESPONSE_CODES.OK).json({
                              statusCode: RESPONSE_CODES.OK,
                              httpStatus: RESPONSE_STATUS.OK,
                              message: "Les categories des menus",
                              result: categories
                    })
          } catch (error) {
                    console.log(error)
                    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                              statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                              httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                              message: "Erreur interne du serveur, réessayer plus tard",

                    })
          }
}
const createMenu = async (req, res) => {
          try {
                    const {
                              ID_CATEGORIE_MENU,
                              ID_PARTENAIRE_SERVICE,
                              PRIX,
                              NOM,
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
                    const { insertId: ID_RESTAURANT_MENU } = await restaurant_menus_model.createMenu(
                              ID_CATEGORIE_MENU,
                              ID_PARTENAIRE_SERVICE,
                              PRIX,
                              NOM,
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
                                        ecommerce_variant_combination.push([ID_RESTAURANT_MENU, inventory.price, inventory.id])
                              })
                              if (ecommerce_variant_combination.length > 0) {
                                        await query('INSERT INTO restaurant_variant_combination(ID_RESTAURANT_MENU, PRIX, FRONTEND_COMBINAISON_ID) VALUES ?', [ecommerce_variant_combination])
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
                    }
                    res.status(RESPONSE_CODES.CREATED).json({
                              statusCode: RESPONSE_CODES.CREATED,
                              httpStatus: RESPONSE_STATUS.CREATED,
                              message: "Enregistrement du produit est fait avec succès",
                              result: {
                                        ID_RESTAURANT_MENU
                              }
                    })
          } catch (error) {
                    console.log(error)
                    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                              statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                              httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                              message: "Enregistrement echoue",
                    })
          }
}
const createNotes = async (req, res) => {
    try {

        const { ID_RESTAURANT_MENU, NOTE, COMMENTAIRE } = req.body
        const { insertId } = await restaurant_menus_model.createnotes(
            req.userId,
            ID_RESTAURANT_MENU,
            NOTE,
            COMMENTAIRE
        )
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Enregistrement est fait avec succès",
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

const getMenuVariants = async (req, res) => {
          try {
                    const { ID_RESTAURANT_MENU } = req.params
                    const allVariants = await query('SELECT * FROM  restaurant_menu_variants WHERE ID_RESTAURANT_MENU = ?', [ID_RESTAURANT_MENU])
                    const allOptions = await query('SELECT * FROM restaurant_variant_values WHERE ID_RESTAURANT_MENU = ?', [ID_RESTAURANT_MENU])
                    const allCombinaisons = await query('SELECT * FROM  restaurant_variant_combination WHERE ID_RESTAURANT_MENU = ?', [ID_RESTAURANT_MENU])
                    const combinaisonsIds = allCombinaisons.map(comb => comb.ID_COMBINATION)
                    var allCombinaisonsOptions = []
                    if (combinaisonsIds.length > 0) {
                              allCombinaisonsOptions = await query('SELECT * FROM restaurant_variant_combination_values WHERE ID_COMBINATION IN (?)', [combinaisonsIds])
                    }
                    const variants = allVariants.map(variant => {
                              const values = allOptions.filter(option => option.ID_VARIANT == variant.ID_VARIANT)
                              return {
                                        ...variant,
                                        values
                              }
                    })
                    const combinaisons = allCombinaisons.map(combinaison => {
                              const values = allCombinaisonsOptions.filter(comb => comb.ID_COMBINATION == combinaison.ID_COMBINATION)
                              return {
                                        ...combinaison,
                                        values
                              }
                    })
                    res.status(RESPONSE_CODES.OK).json({
                              statusCode: RESPONSE_CODES.OK,
                              httpStatus: RESPONSE_STATUS.OK,
                              message: "Les variantes des menus",
                              result: {
                                        variants,
                                        combinaisons
                              }
                    })
          } catch (error) {
                    console.log(error)
                    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                              statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                              httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                              message: "Erreur interne du serveur, réessayer plus tard",
                    })
          }
}

module.exports = {
          getAllmenu,
          getCategories,
          createMenu,
          getMenuVariants,
          createRestaurant_wishlist_menu,
          WishlistMenu,
          createNotes,
          getnotesMenus,
          getuserNotes,
          updateNote,
          deleteNote

}