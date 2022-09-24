const partenaireProduitModel = require('../models/partenaire.produit.model')
const Validation = require('../class/Validation')
const jwt = require("jsonwebtoken");
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const generateToken = require('../utils/generateToken');
const path = require("path");
const ProductUpload = require("../class/uploads/ProductUpload")
const createProduit = async (req, res) => {
          try {
                    const {
                              ID_PRODUIT,
                              ID_CATEGORIE_PRODUIT,
                              ID_PRODUIT_SOUS_CATEGORIE,
                              ID_TAILLE,
                              NOM,
                              DESCRIPTION,
                              QUANTITE_STOCKE,
                              QUANTIPRIX,
                              ID_STATUT
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
                                        ID_PRODUIT:
                                        {
                                                  exists: "ecommerce_produits,ID_PRODUIT",
                                        },
                                        ID_CATEGORIE_PRODUIT:
                                        {
                                                  exists: "ecommerce_produit_categorie,ID_CATEGORIE_PRODUIT",
                                        },
                                        ID_PRODUIT_SOUS_CATEGORIE:
                                        {
                                                  exists: "ecommerce_produit_sous_categorie,ID_PRODUIT_SOUS_CATEGORIE",
                                        },
                                        ID_TAILLE:
                                        {
                                                  exists: "ecommerce_produit_tailles,ID_TAILLE",
                                        },
                                        NOM:
                                        {
                                                  required: true,
                                        },
                                        DESCRIPTION:
                                        {
                                                  required: true,
                                        },
                                        QUANTITE_STOCKE:
                                        {
                                                  required: true,
                                        },
                                        QUANTIPRIX: {
                                                  required: true,
                                        },
                                        ID_STATUT:
                                        {
                                                  exists: "ecommerce_statut_prix,ID_STATUT",
                                        },

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
                                        ID_PRODUIT:
                                        {
                                                  exists: "Produit  invalide",
                                        },
                                        ID_CATEGORIE_PRODUIT:
                                        {
                                                  exists: "categorie invalide",
                                        },
                                        ID_PRODUIT_SOUS_CATEGORIE:
                                        {
                                                  exists: "sous categorie invalide",
                                        },
                                        ID_TAILLE:
                                        {
                                                  exists: "taille invalide",
                                        },
                                        NOM:
                                        {
                                                  required: "nom du produit  est obligatoire"
                                        },
                                        DESCRIPTION:
                                        {
                                                  required: "description d'un produit  est obligatoire",
                                        },
                                        QUANTITE_STOCKE:
                                        {
                                                  required: "quantite  est obligatoire",
                                        },
                                        QUANTIPRIX: {
                                                  required: "prix  est obligatoire",
                                        },
                                        ID_STATUT:
                                        {
                                                  exists: "statut du prix invalide",
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
                    const productUpload = new ProductUpload()
                    var filename_2
                    var filename_3
                    const { fileInfo: fileInfo_1, thumbInfo: thumbInfo_1 } = await productUpload.upload(IMAGE_1, false)
                    if(IMAGE_2) {
                              const { fileInfo: fileInfo_2, thumbInfo: thumbInfo_2 } = await productUpload.upload(IMAGE_2, false)
                              filename_2 = fileInfo_2.fileName
                    }
                    if(IMAGE_3) {
                              const { fileInfo: fileInfo_3, thumbInfo: thumbInfo_3 } = await productUpload.upload(IMAGE_3, false)
                              filename_3 = fileInfo_3.fileName
                    }

                    const { insertId: insertProduit } = await partenaireProduitModel.createProduit(
                              ID_PRODUIT,
                              1,
                              ID_CATEGORIE_PRODUIT,
                              ID_PRODUIT_SOUS_CATEGORIE,
                              ID_TAILLE,
                              NOM,
                              DESCRIPTION,
                              fileInfo_1.fileName,
                              filename_2 ? filename_2 : null,
                              filename_3 ? filename_3 : null
                    )
                    const { insertId: insertStock } = await partenaireProduitModel.createStock(
                              insertProduit,
                              QUANTITE_STOCKE,
                              QUANTITE_STOCKE,
                              0,
                              //IMAGE
                    )
                    const { insertId: insertPrix } = await partenaireProduitModel.createPrix(
                              insertStock,
                              QUANTIPRIX,
                              1
                              //IMAGE
                    )
                    const produit = (await partenaireProduitModel.findById(insertProduit))[0]
                    res.status(RESPONSE_CODES.CREATED).json({
                              statusCode: RESPONSE_CODES.CREATED,
                              httpStatus: RESPONSE_STATUS.CREATED,
                              message: "Enregistrement est fait avec succès",
                              result: produit
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
          const { id } = req.params
          try {

                    const service = await partenaireProduitModel.findByIdPartenaire(id)
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
          findByIdProduit
}