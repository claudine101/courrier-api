const partenaireProduitModel = require('../models/partenaire.produit.model')
const Validation = require('../class/Validation')
const jwt = require("jsonwebtoken");
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const generateToken = require('../utils/generateToken');
const path = require("path");
const ProductUpload = require("../class/uploads/ProductUpload");
const { query } = require('../utils/db');
const { json } = require('express');
const IMAGES_DESTINATIONS = require('../constants/IMAGES_DESTINATIONS');
const createProduit = async (req, res) => {
          try {
                    const {
                              ID_PARTENAIRE_SERVICE,
                              ID_CATEGORIE_PRODUIT,
                              ID_PRODUIT_SOUS_CATEGORIE,
                              NOM,
                              DESCRIPTION,
                              MONTANT,
                              variants: varStr,
                              inventories: invStr
                    } = req.body
                    var variants, inventories
                    if(varStr) variants = JSON.parse(varStr)
                    if(invStr) inventories = JSON.parse(invStr)
                    const { IMAGE_1, IMAGE_2, IMAGE_3 } = req.files || {}
                    const validation = new Validation(
                              { ...req.body, ...req.files },
                              {
                                        IMAGE_1: {
                                                  required: true,
                                                  image: 21000000
                                        },
                                        ID_CATEGORIE_PRODUIT: {
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
                                        MONTANT: {
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
                                        ID_CATEGORIE_PRODUIT: {
                                                  exists: "categorie invalide",
                                        },
                                        ID_PRODUIT_SOUS_CATEGORIE: {
                                                  exists: "sous categorie invalide",
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
                    const { insertId: ID_PRODUIT } = await partenaireProduitModel.createProduit(
                              ID_CATEGORIE_PRODUIT,
                              ID_PRODUIT_SOUS_CATEGORIE ? ID_PRODUIT_SOUS_CATEGORIE : null,
                              NOM,
                              MONTANT,
                              DESCRIPTION ? DESCRIPTION : null,
                              ID_PARTENAIRE_SERVICE,
                              `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.products}/${fileInfo_1.fileName}`,
                              filename_2 ? `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.products}/${filename_2.fileName}` : null,
                              filename_3 ? `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.products}/${filename_3.fileName}` : null
                    )
                    if(variants && variants.length > 0) {
                              await Promise.all(variants.map(async variant => {
                                        const { insertId: ID_VARIANT } = await query('INSERT INTO ecommerce_produit_variants(ID_PRODUIT, FRONTEND_VARIANT_ID, VARIANT_NAME) VALUES(?, ?, ?)', [
                                                  ID_PRODUIT, variant.id, variant.variantName
                                        ])
                                        const ecommerce_variant_values = []
                                        variant.options.forEach(option => {
                                                  ecommerce_variant_values.push([
                                                            ID_PRODUIT,
                                                            ID_VARIANT,
                                                            option.id,
                                                            option.name
                                                  ])
                                        })
                                        if(ecommerce_variant_values.length > 0) {
                                                  await query('INSERT INTO ecommerce_variant_values(ID_PRODUIT, ID_VARIANT, FRONTEND_VALUE_ID, VALUE_NAME) VALUES ?', [ecommerce_variant_values])
                                        }
                              }))
                    }
                    if(inventories && inventories.length > 0) {
                              const ecommerce_variant_combination = []
                              inventories.forEach(inventory => {
                                        ecommerce_variant_combination.push([ID_PRODUIT, inventory.quantity, inventory.price, inventory.id])
                              })
                              if(ecommerce_variant_combination.length > 0) {
                                        await query('INSERT INTO ecommerce_variant_combination(ID_PRODUIT, QUANTITE, PRIX, FRONTEND_COMBINAISON_ID) VALUES ?', [ecommerce_variant_combination])
                              }
                              const newCombinaisons = await query('SELECT * FROM ecommerce_variant_combination WHERE ID_PRODUIT = ?', [ID_PRODUIT])
                              const values = await query('SELECT * FROM ecommerce_variant_values WHERE ID_PRODUIT = ?', [ID_PRODUIT])
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
                              if(ecommerce_variant_combination_values.length > 0) {
                                        await query('INSERT INTO ecommerce_variant_combination_values(ID_COMBINATION, ID_VALUE) VALUES ?', [ecommerce_variant_combination_values])
                              }
                              console.log({ ecommerce_variant_combination_values, length: ecommerce_variant_combination_values.length})
                    }
                    res.status(RESPONSE_CODES.CREATED).json({
                              statusCode: RESPONSE_CODES.CREATED,
                              httpStatus: RESPONSE_STATUS.CREATED,
                              message: "Enregistrement du produit est fait avec succès",
                              result: {
                                        ID_PRODUIT
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
const findByIdPartenaire = async (req, res) => {
          try {
                    const { id_partenaire_service } = req.params
                    const { limit, offset, category } = req.query
                    const pureProducts = await partenaireProduitModel.findByIdPartenaire(id_partenaire_service, limit, offset,category)
                    const productsIds = pureProducts.map(product => product.ID_PRODUIT)
                    const quantities = await query('SELECT SUM(QUANTITE) quantity, ID_PRODUIT FROM ecommerce_variant_combination WHERE ID_PRODUIT IN (?) GROUP BY ID_PRODUIT', [productsIds])
                    const products = pureProducts.map(product => {
                              const quantity = quantities.find(q => q.ID_PRODUIT == product.ID_PRODUIT)
                              return {
                                        ...product,
                                        quantity: quantity ? parseInt(quantity.quantity) : 1
                              }
                    })
                    res.status(RESPONSE_CODES.OK).json({
                              statusCode: RESPONSE_CODES.OK,
                              httpStatus: RESPONSE_STATUS.OK,
                              message: "succès",
                              result: products
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
const deleteProduit = async (req, res) => {
          try {
                    const { ID_PRODUIT_PARTENAIRE,
                              ID_PARTENAIRE_SERVICE } = req.params
                    const stock = (await query('SELECT ID_PRODUIT_STOCK FROM ecommerce_produit_stock WHERE ID_PRODUIT_PARTENAIRE = ?', [ID_PRODUIT_PARTENAIRE]))[0]
                    await query('DELETE FROM ecommerce_produit_partenaire WHERE ID_PRODUIT_PARTENAIRE=?', [ID_PRODUIT_PARTENAIRE])
                    await query('DELETE FROM ecommerce_produit_stock WHERE ID_PRODUIT_STOCK=?', [stock.ID_PRODUIT_STOCK])
                    await query('DELETE FROM  ecommerce_commande_details WHERE ID_PRODUIT_STOCK=?', [stock.ID_PRODUIT_PARTENAIRE])
                    await query('DELETE FROM  ecommerce_produit_details WHERE ID_PRODUIT_STOCK=?', [stock.ID_PRODUIT_PARTENAIRE])
                    await query('DELETE FROM  ecommerce_stock_prix WHERE ID_PRODUIT_STOCK=?', [stock.ID_PRODUIT_PARTENAIRE])
                    await query('DELETE FROM  ecommerce_wishlist_produit WHERE ID_PRODUIT_PARTENAIRE=?', [ID_PRODUIT_PARTENAIRE])

                    const getImageUri = (fileName) => {
                              if (!fileName) return null
                              if (fileName.indexOf("http") === 0) return fileName
                              return `${req.protocol}://${req.get("host")}/uploads/partenaire/${fileName}`
                    }
                    var sqlQuery = "SELECT ps.*, s.NOM NOM_SERVICE FROM partenaire_service ps "
                    sqlQuery += " LEFT JOIN partenaires p ON p.ID_PARTENAIRE = ps.ID_PARTENAIRE "
                    sqlQuery += " LEFT JOIN services s ON s.ID_SERVICE = ps.ID_SERVICE "
                    sqlQuery += " WHERE ps.ID_PARTENAIRE_SERVICE=?"
                    const svs = await query(sqlQuery, [ID_PARTENAIRE_SERVICE])
                    const services = svs.map(service => ({
                              ...service,
                              LOGO: getImageUri(service.LOGO),
                              BACKGROUND_IMAGE: getImageUri(service.BACKGROUND_IMAGE)
                    }))
                    res.status(RESPONSE_CODES.OK).json({
                              statusCode: RESPONSE_CODES.OK,
                              httpStatus: RESPONSE_STATUS.OK,
                              message: "succès",
                              result: services
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
const findDetailsProduit = async (req, res) => {
          try {
                    const { id_produit_partenaire } = req.params
                    const getImageUri = (fileName) => {
                              if (!fileName) return null
                              if (fileName.indexOf("http") === 0) return fileName
                              return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
                    }
                    const Detailsproduits = await partenaireProduitModel.findProduitAllDetail(id_produit_partenaire)
                    // const products = await Promise.all(Allproduits.map(async product => {
                    //         const prix = (await partenaireProduitModel.findAllPrix(product.ID_PRODUIT_PARTENAIRE))[0]
                    //         if (prix) {
                    //                 return {
                    //                         produit: {
                    //                                 ID_PRODUIT: product.ID_PRODUIT,
                    //                                 NOM: product.NOM,
                    //                                 IMAGE: product.IMAGE_1
                    //                         },
                    //                         partenaire: {
                    //                                 NOM_ORGANISATION: product.NOM_ORGANISATION,
                    //                                 EMAIL: product.EMAIL,
                    //                         },
                    //                         produit_partenaire: {
                    //                                 ID_PRODUIT_PARTENAIRE: product.ID_PRODUIT_PARTENAIRE,
                    //                                 IMAGE_1: getImageUri(product.IMAGE_1),
                    //                                 IMAGE_2: getImageUri(product.IMAGE_2),
                    //                                 IMAGE_3: getImageUri(product.IMAGE_3),
                    //                                 PRIX: prix.PRIX,
                    //                                 NOM: product.NOM_ORGANISATION,
                    //                         },
                    //                         stock: {
                    //                                 QUANTITE_STOCKE: prix.QUANTITE_TOTAL,
                    //                                 QUANTITE_VENDUE: prix.QUANTITE_VENDUS,
                    //                                 QUANTITE_RESTANTE: prix.QUANTITE_RESTANTE
                    //                         },
                    //                         taille: {
                    //                                 ID_TAILLE: prix.ID_TAILLE,
                    //                                 TAILLE: prix.TAILLE
                    //                         },
                    //                         couleur: {
                    //                                 ID_COULEUR: prix.ID_COULEUR,
                    //                                 COULEUR: prix.COULEUR
                    //                         },
                    //                         categorie: {
                    //                                 ID_CATEGORIE_PRODUIT: product.ID_CATEGORIE_PRODUIT,
                    //                                 NOM_CATEGORIE: product.NOM_CATEGORIE
                    //                         },
                    //                         sous_categorie: {
                    //                                 ID_PRODUIT_SOUS_CATEGORIE: product.ID_PRODUIT_SOUS_CATEGORIE,
                    //                                 SOUS_CATEGORIE: product.SOUS_CATEGORIE
                    //                         },
                    //                 }
                    //         }
                    // }))
                    const produits = Detailsproduits.map(produit => ({
                              detail: {
                                        ID_DETAIL: produit.ID_DETAIL,
                                        ID_PRODUIT_PARTENAIRE: produit.ID_PRODUIT_PARTENAIRE,
                                        ID_PARTENAIRE_SERVICE: produit.ID_PARTENAIRE_SERVICE,
                              },
                              produit: {
                                        ID_PRODUIT: produit.ID_PRODUIT,
                                        NOM: produit.NOM,
                                        IMAGE_1: getImageUri(produit.IMAGE_1),
                                        IMAGE_2: getImageUri(produit.IMAGE_2),
                                        IMAGE_3: getImageUri(produit.IMAGE_3),
                              },
                              stock: {
                                        QUANTITE_TOTAL: produit.QUANTITE_TOTAL,
                                        QUANTITE_VENDUS: produit.QUANTITE_VENDUS,
                                        QUANTITE_RESTANTE: produit.QUANTITE_RESTANTE,
                              },
                              categorie: {
                                        ID_CATEGORIE_PRODUIT: produit.ID_CATEGORIE_PRODUIT,
                                        NOM_CATEGORIE: produit.NOM_CATEGORIE,
                              },
                              sous_categorie: {
                                        ID_PRODUIT_SOUS_CATEGORIE: produit.ID_PRODUIT_SOUS_CATEGORIE,
                                        SOUS_CATEGORIE: produit.SOUS_CATEGORIE,
                              },
                              taille: {
                                        ID_TAILLE: produit.ID_TAILLE,
                                        TAILLE: produit.TAILLE,
                              },
                              couleur: {
                                        ID_COULEUR: produit.ID_COULEUR,
                                        COULEUR: produit.COULEUR,
                              },
                    }))
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
const findByIdProduit = async (req, res) => {
          const { id } = req.params
          try {

                    const produit = await partenaireProduitModel.findByIdPoduit(req.userId, id)
                    res.status(RESPONSE_CODES.OK).json({
                              statusCode: RESPONSE_CODES.OK,
                              httpStatus: RESPONSE_STATUS.OK,
                              message: "succès",
                              result: produit
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
          createProduit,
          findByIdPartenaire,
          deleteProduit,
          findByIdProduit,
          findDetailsProduit
}