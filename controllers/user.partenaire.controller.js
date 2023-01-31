const userPartenaireModel = require('../models/user.partenaire.model')
const partenaireProduitModel = require('../models/partenaire.produit.model')

const Validation = require('../class/Validation')
const PartenaireUpload = require("../class/uploads/PartenaireUpload")
const jwt = require("jsonwebtoken");
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const generateToken = require('../utils/generateToken');
const path = require("path");
const md5 = require('md5');
const UserUpload = require("../class/uploads/UserUpload");
const { query } = require('../utils/db');
const IMAGES_DESTINATIONS = require('../constants/IMAGES_DESTINATIONS');
const login = async (req, res) => {
          try {
                    const { email, password, PUSH_NOTIFICATION_TOKEN, DEVICE } = req.body;
                    const validation = new Validation(
                              req.body,
                              {
                                        email: "required,email",
                                        password:
                                        {
                                                  required: true,
                                        },
                              },
                              {
                                        password:
                                        {
                                                  required: "Mot de passe est obligatoire",
                                        },
                                        email: {
                                                  required: "L'email est obligatoire",
                                                  email: "Email invalide"
                                        }
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
                    var user = (await userPartenaireModel.findBy("EMAIL", email))[0];
                    if (user && user.ID_PROFIL == 2) {
                              if (user.PASSWORD == md5(password)) {
                                        const notification = (await query('SELECT ID_NOTIFICATION_TOKEN FROM notification_tokens WHERE TOKEN = ? AND ID_USER = ?', [PUSH_NOTIFICATION_TOKEN, user.ID_USER]))[0]
                                        if (!notification && PUSH_NOTIFICATION_TOKEN) {
                                                await query('INSERT INTO notification_tokens(ID_USER, DEVICE, TOKEN, ID_PROFIL) VALUES(?, ?, ?, ?)', [user.ID_USER, DEVICE, PUSH_NOTIFICATION_TOKEN, user.ID_PROFIL]);
                                        }
                                        const token = generateToken({ user: user.ID_USER }, 3 * 12 * 30 * 24 * 3600)
                                        const { PASSWORD, USERNAME, ID_TYPE_PARTENAIRE, COUNTRY_ID, ...other } = user
                                        res.status(RESPONSE_CODES.CREATED).json({
                                                  statusCode: RESPONSE_CODES.CREATED,
                                                  httpStatus: RESPONSE_STATUS.CREATED,
                                                  message: "Vous êtes connecté avec succès",
                                                  result: {
                                                            ...other,
                                                            token
                                                  }
                                        })
                              } else {
                                        validation.setError('main', 'Identifiants incorrects')
                                        const errors = await validation.getErrors()
                                        res.status(RESPONSE_CODES.NOT_FOUND).json({
                                                  statusCode: RESPONSE_CODES.NOT_FOUND,
                                                  httpStatus: RESPONSE_STATUS.NOT_FOUND,
                                                  message: "Utilisateur n'existe pas",
                                                  result: errors
                                        })
                              }
                    }else {
                              validation.setError('main', 'Identifiants incorrects')
                              const errors = await validation.getErrors()
                              res.status(RESPONSE_CODES.NOT_FOUND).json({
                                        statusCode: RESPONSE_CODES.NOT_FOUND,
                                        httpStatus: RESPONSE_STATUS.NOT_FOUND,
                                        message: "Utilisateur n'existe pas",
                                        result: errors
                              })
                    }
          } catch (error) {
                    console.log(error)
                    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                              statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                              httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                              message: "La connexion echoue Verifier les identifiants",
                    })
          }
}
const createUser = async (req, res) => {
          try {
                    const { NOM, PRENOM, EMAIL, USERNAME, PASSWORD, SEXE, DATE_NAISSANCE, COUNTRY_ID, ADRESSE, TELEPHONE_1, TELEPHONE_2, PUSH_NOTIFICATION_TOKEN, DEVICE } = req.body
                    const { IMAGE } = req.files || {}
                    const validation = new Validation({ ...req.body, ...req.files },
                              {
                                        NOM:
                                        {
                                                  required: true,
                                        },
                                        IMAGE: {
                                                  image: 21000000
                                        },
                                        PRENOM:
                                        {
                                                  required: true,
                                        },
                                        EMAIL:
                                        {
                                                  required: true,
                                                  email: true,
                                                  unique: "users,EMAIL"
                                        },

                PASSWORD:
                {
                    required: true,
                },

                              },
                              {
                                        IMAGE: {
                                                  IMAGE: "La taille invalide"
                                        },
                                        NOM: {
                                                  required: "Le nom est obligatoire"
                                        },
                                        PRENOM: {
                                                  required: "Le prenom est obligatoire"
                                        },
                                        EMAIL: {
                                                  required: "L'email est obligatoire",
                                                  email: "Email invalide",
                                                  unique: "Email déjà utilisé"
                                        },
                                        PASSWORD: {
                                                  required: "Le mot de passe est obligatoire"
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
                    const userUpload = new UserUpload()
                    var filename
                    if (IMAGE) {
                              const { fileInfo } = await userUpload.upload(IMAGE, false)
                              filename = fileInfo.fileName
                    }
                    const { insertId } = await userPartenaireModel.createOne(
                              NOM,
                              PRENOM,
                              EMAIL,
                              USERNAME,
                              md5(PASSWORD),
                              2,
                              SEXE,
                              DATE_NAISSANCE,
                              COUNTRY_ID,
                              ADRESSE,
                              TELEPHONE_1,
                              TELEPHONE_2,
                              filename ? filename : null
                    )
                    const { insertId: ID_PARTENAIRE } = await userPartenaireModel.createOnePartenaire(insertId)
                    const user = (await userPartenaireModel.findById(insertId))[0]
                    const notification = (await query('SELECT ID_NOTIFICATION_TOKEN FROM notification_tokens WHERE TOKEN = ? AND ID_USER = ?', [PUSH_NOTIFICATION_TOKEN, user.ID_USER]))[0]
                                if (!notification && PUSH_NOTIFICATION_TOKEN) {
                                await query('INSERT INTO notification_tokens(ID_USER, DEVICE, TOKEN, ID_PROFIL) VALUES(?, ?, ?, ?)', [user.ID_USER, DEVICE, PUSH_NOTIFICATION_TOKEN, user.ID_PROFIL]);
                        }
                    const token = generateToken({ user: user.ID_USER }, 3 * 12 * 30 * 24 * 3600)
                    const { PASSWORD: pw, USERNAME: usr, ID_PROFIL, IMAGE: img, ID_PARTENAIRE: idp, ID_TYPE_PARTENAIRE, COUNTRY_ID: ctr, ...other } = user
                    res.status(RESPONSE_CODES.CREATED).json({
                              statusCode: RESPONSE_CODES.CREATED,
                              httpStatus: RESPONSE_STATUS.CREATED,
                              message: "Enregistrement est fait avec succès",
                              result: {
                                        ...other,
                                        ID_PARTENAIRE,
                                        token
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
const createPartenaire = async (req, res) => {
    try {
        const { ID_TYPE_PARTENAIRE, NOM_ORGANISATION, TELEPHONE, NIF, EMAIL, ADRESSE_COMPLETE, LATITUDE, LONGITUDE, ID_SERVICE } = req.body
        const { LOGO, BACKGROUND_IMAGE } = req.files || {}
        const partenaire = (await query('SELECT * FROM partenaires WHERE ID_USER = ?', [req.userId]))[0]
        if (!partenaire) throw new Error("Partenaire not found")
        const validation = new Validation({ ...req.body, ...req.files },
            {
                LOGO: {
                    image: 21000000,
                    required: true
                },
                BACKGROUND_IMAGE: {
                    image: 21000000
                },
            },
            {
                LOGO: {
                    image: "La taille invalide"
                },
                BACKGROUND_IMAGE: {
                    image: "La taille invalide"
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
        const partenaireUpload = new PartenaireUpload()
        var backgoundImage = null
        const { fileInfo: fileInfo_1 } = await partenaireUpload.upload(LOGO, false)
        const logoImage = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.partenaires}/${fileInfo_1.fileName}`;
        if (BACKGROUND_IMAGE) {
            const { fileInfo: fileInfo_2 } = await partenaireUpload.upload(BACKGROUND_IMAGE, false)
            backgoundImage = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.partenaires}/${fileInfo_2.fileName}`;
        }
        const { insertId } = await userPartenaireModel.createpartenaire(
            partenaire.ID_PARTENAIRE,
            ID_SERVICE,
            ID_TYPE_PARTENAIRE,
            NOM_ORGANISATION,
            TELEPHONE,
            ID_TYPE_PARTENAIRE == 2 ? NIF : null,
            EMAIL,
            logoImage,
            backgoundImage,
            ID_TYPE_PARTENAIRE == 2 ? ADRESSE_COMPLETE : null,
            LATITUDE,
            LONGITUDE
        )
        const service = (await userPartenaireModel.findByIdPartenai(insertId))[0]
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Enregistrement est fait avec succès",
            result: service
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
const createLivreur = async (req, res) => {
    try {
        const { ID_PARTENAIRE, ID_SERVICE, NOM, PRENOM, TELEPHONE, NIF, EMAIL, NUMERO_PLAQUE, MODELE, MARQUE, NOMBRE_PLACE } = req.body
        const { IMAGE_1, IMAGE_2 } = req.files || {}

        const validation = new Validation({ ...req.body, ...req.files },
            {
                IMAGE_1: {
                    image: 21000000,
                    required: true,
                },
                IMAGE_2: {
                    image: 21000000,
                    required: true,
                },
                NOM:
                {
                    required: true,
                },
                PRENOM:
                {
                    required: true,
                },
                EMAIL:
                {
                    required: true,
                },
                NUMERO_PLAQUE:
                {
                    required: true,
                },
                MODELE:
                {
                    required: true,
                },
                MARQUE:
                {
                    required: true,
                },
                NOMBRE_PLACE:
                {
                    required: true,
                },
                TELEPHONE: {
                    required: true,
                },

            },
            {
                IMAGE_1: {
                    image: "La taille invalide"
                },
                IMAGE_1: {
                    image: "La taille invalide"
                },
                NOM: {
                    nom: "Le nom est obligatoire"
                },
                PRENOM: {
                    prenom: "Le prenom est obligatoire"
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
        const partenaireUpload = new PartenaireUpload()
        var Image3 = null
        const { fileInfo: fileInfo_1 } = await partenaireUpload.upload(IMAGE_1, false)
        const Image1 = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.partenaires}/${fileInfo_1.fileName}`;

        const { fileInfo: fileInfo_2 } = await partenaireUpload.upload(IMAGE_2, false)
        const Image2 = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.partenaires}/${fileInfo_2.fileName}`;
        // if (IMAGE_3) {
        //     const { fileInfo: fileInfo_3 } = await partenaireUpload.upload(IMAGE_3, false)
        //     Image3 = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.partenaires}/${fileInfo_3.fileName}`;
        // }
        const { insertId } = await userPartenaireModel.createpartenaireLivreur(
            ID_PARTENAIRE,
            1,
            ID_SERVICE,
            TELEPHONE,
            NOM + "_" + PRENOM,
            NIF,
            EMAIL,
            Image1,
            Image2
        )

        const { LivreurId } = await userPartenaireModel.insertLivreur(
            insertId,
            NOM,
            PRENOM,
            NUMERO_PLAQUE,
            MODELE,
            MARQUE,
            NOMBRE_PLACE,
            Image1,
            Image2,
            Image3,

        )
        const partenaire_service = (await userPartenaireModel.findByIdPartenaireService(insertId))[0]
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Enregistrement est fait avec succès",
            result: partenaire_service
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

const UpdatePartenaire = async (req, res) => {
    try {

        const { NOM_ORGANISATION, TELEPHONE, NIF, EMAIL, ADRESSE_COMPLETE, LATITUDE, LONGITUDE } = req.body
        const { ID_PARTENAIRE_SERVICE } = req.params
        const { LOGO, BACKGROUND_IMAGE } = req.files || {}
        const partenaireService = (await query('SELECT * FROM partenaire_service WHERE ID_PARTENAIRE_SERVICE = ?', [ID_PARTENAIRE_SERVICE]))[0]
        //console.log(partenaireService.BACKGROUND_IMAGE)
        const validation = new Validation({ ...req.body, ...req.files },
            {
                LOGO: {
                    image: 21000000,

                },
                BACKGROUND_IMAGE: {
                    image: 21000000
                },
            },
            {
                LOGO: {
                    image: "La taille invalide"
                },
                BACKGROUND_IMAGE: {
                    image: "La taille invalide"
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
        const partenaireUpload = new PartenaireUpload()
        var backgoundImage = null
        var logoImage = null
        if (LOGO) {
            const { fileInfo: fileInfo_1 } = await partenaireUpload.upload(LOGO, false)
            logoImage = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.partenaires}/${fileInfo_1.fileName}`;

        }


        if (BACKGROUND_IMAGE) {
            const { fileInfo: fileInfo_2 } = await partenaireUpload.upload(BACKGROUND_IMAGE, false)
            backgoundImage = `${req.protocol}://${req.get("host")}${IMAGES_DESTINATIONS.partenaires}/${fileInfo_2.fileName}`;
        }
        const { insertId } = await userPartenaireModel.changeService(

            NOM_ORGANISATION ? NOM_ORGANISATION : partenaireService.NOM_ORGANISATION,
            TELEPHONE ? TELEPHONE : partenaireService.TELEPHONE,
            NIF ? NIF : partenaireService.NIF,
            EMAIL ? EMAIL : partenaireService.EMAIL,
            ADRESSE_COMPLETE ? ADRESSE_COMPLETE : partenaireService.ADRESSE_COMPLETE,
            LATITUDE ? LATITUDE : partenaireService.LATITUDE,
            LONGITUDE ? LONGITUDE : partenaireService.LONGITUDE,
            LOGO ? logoImage : partenaireService.LOGO,
            BACKGROUND_IMAGE ? backgoundImage : partenaireService.BACKGROUND_IMAGE,
            ID_PARTENAIRE_SERVICE


        )
        const service = (await userPartenaireModel.findByIdPartenai(insertId))[0]
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "La modification est fait avec succès",
            result: service
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

const getAllPartenaire = async (req, res) => {
    try {
        const getImageUri = (fileName, folder) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/${folder}/${fileName}`
        }

        const { lat, long, shop, limit, offset } = req.query
        const allPartenaire = await userPartenaireModel.findpartenaire(lat, long, shop, limit, offset)

        const partenaires = await Promise.all(allPartenaire.map(async partenaire => {
            const categorie = await userPartenaireModel.findbycategorie(partenaire.ID_PARTENAIRE_SERVICE)
            const note = (await userPartenaireModel.findNote(partenaire.ID_PARTENAIRE_SERVICE))[0]
            return {
                ...partenaire,
                LOGO: getImageUri(partenaire.LOGO, 'partenaire'),
                IMAGE: getImageUri(partenaire.IMAGE, 'users'),
                categories: categorie,
                note: note

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
const getOnePartenaire = async (req, res) => {

    try {
        const getImageUri = (fileName, folder) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/${folder}/${fileName}`
        }

        const { lat, long, shop, limit, offset } = req.query
        const { ID_PARTENAIRE_SERVICE } = req.params
        const allPartenaire = (await userPartenaireModel.findpartenaireOne(ID_PARTENAIRE_SERVICE, lat, long, shop, limit, offset))[0]

        const partenaires = await Promise.all(allPartenaire.map(async partenaire => {
            const categorie = await userPartenaireModel.findbycategorie(partenaire.ID_PARTENAIRE_SERVICE)
            const note = (await userPartenaireModel.findNote(partenaire.ID_PARTENAIRE_SERVICE))[0]

            return {
                ...partenaire,
                LOGO: getImageUri(partenaire.LOGO, 'partenaire'),
                IMAGE: getImageUri(partenaire.IMAGE, 'users'),
                categories: categorie,
                note: note

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


const getcategories = async (req, res) => {
    try {
        const { ID_PARTENAIRE } = req.params
        const categories = await userPartenaireModel.findcategories(ID_PARTENAIRE)
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_CODES.OK,
            message: "Liste  categories",
            result: categories


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

const findByIdPartenaire = async (req, res) => {
    const { id } = req.params
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }
        const { category, subCategory, limit, offset } = req.query
        const Allservice = await userPartenaireModel.findByIdPartenaire(id, category, subCategory, limit, offset)
        const products = Allservice.map(product => ({
            produit: {
                ID_PRODUIT: product.ID_PRODUIT,
                NOM: product.NOM,
                IMAGE: product.IMAGE
            },
            partenaire: {
                NOM_ORGANISATION: product.NOM_ORGANISATION,
                ID_PARTENAIRE: product.ID_PARTENAIRE,
                ID_TYPE_PARTENAIRE: product.ID_TYPE_PARTENAIRE,
                NOM: product.NOM_USER,
                PRENOM: product.PRENOM
            },
            produit_partenaire: {
                ID_PRODUIT_PARTENAIRE: product.ID_PRODUIT_PARTENAIRE,
                NOM: product.NOM_PRODUIT_PARTENAIRE,
                DESCRIPTION: product.DESCRIPTION,
                IMAGE_1: getImageUri(product.IMAGE_1),
                IMAGE_2: getImageUri(product.IMAGE_2),
                IMAGE_3: getImageUri(product.IMAGE_3),
                TAILLE: product.NOM_TAILLE,
                PRIX: product.PRIX
            },
            categorie: {
                ID_CATEGORIE_PRODUIT: product.ID_CATEGORIE_PRODUIT,
                NOM: product.NOM_CATEGORIE
            },
            sous_categorie: {
                ID_PRODUIT_SOUS_CATEGORIE: product.ID_PRODUIT_SOUS_CATEGORIE,
                NOM: product.NOM_SOUS_CATEGORIE
            },
            stock: {
                ID_PRODUIT_STOCK: product.ID_PRODUIT_STOCK,
                QUANTITE_STOCKE: product.QUANTITE_STOCKE,
                QUANTITE_RESTANTE: product.QUANTITE_RESTANTE,
                QUANTITE_VENDUE: product.QUANTITE_VENDUE
            }
        }))
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

const getProduits = async (req, res) => {
    const { id } = req.params
    try {
        const produits = await query("SELECT cat.NOM,pt.ID_PRODUIT,pt.NOM as NOM_PRODUIT  FROM ecommerce_produits  pt LEFT JOIN ecommerce_produit_categorie cat ON pt.ID_CATEGORIE_PRODUIT=cat.ID_CATEGORIE_PRODUIT WHERE cat.ID_CATEGORIE_PRODUIT=" + id);
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste de tous les produits",
            result: produits
        })
    } catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard"
        })
    }
}
const findAll = async (req, res) => {

    try {
        const partenaires = await query("SELECT ps.NOM_ORGANISATION  AS  NOM_ORGANISATION ,ps.ID_PARTENAIRE_SERVICE,par.ID_PARTENAIRE FROM partenaires par LEFT JOIN partenaire_service ps ON par.ID_PARTENAIRE=ps.ID_PARTENAIRE WHERE 1 and ps.NOM_ORGANISATION!=''");
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste de tous les partenaires",
            result: partenaires
        })
    } catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard"
        })
    }
}
const findAllShop = async (req, res) => {

    try {
        const partenaires = await query("SELECT ps.NOM_ORGANISATION  AS  NOM_ORGANISATION ,ps.ID_PARTENAIRE_SERVICE,par.ID_PARTENAIRE FROM partenaires par LEFT JOIN partenaire_service ps ON par.ID_PARTENAIRE=ps.ID_PARTENAIRE WHERE ps.ID_SERVICE=1 and ps.NOM_ORGANISATION!=''");
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste de tous les partenaires",
            result: partenaires
        })
    } catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard"
        })
    }
}
const findAllResto = async (req, res) => {

    try {
        const partenaires = await query("SELECT ps.NOM_ORGANISATION  AS  NOM_ORGANISATION ,ps.ID_PARTENAIRE_SERVICE,par.ID_PARTENAIRE FROM partenaires par LEFT JOIN partenaire_service ps ON par.ID_PARTENAIRE=ps.ID_PARTENAIRE WHERE ps.ID_SERVICE=2 and ps.NOM_ORGANISATION!=''");
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Liste de tous les partenaires",
            result: partenaires
        })
    } catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard"
        })
    }
}

const UpdateShop = async (req, res) => {

    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
        }
        const { NOM_ORGANISATION, TELEPHONE, ADRESSE, PRESENTATION, OUVERT } = req.body
        const { ID_PARTENAIRE_SERVICE } = req.params
        const partenaires = await query("UPDATE partenaire_service SET NOM_ORGANISATION=?,TELEPHONE=?,ADRESSE_COMPLETE=?,PRESENTATION=?,OUVERT=? WHERE ID_PARTENAIRE_SERVICE=?", [NOM_ORGANISATION, TELEPHONE, ADRESSE, PRESENTATION, OUVERT, ID_PARTENAIRE_SERVICE]);
        const partenireUpdat = (await query("SELECT * FROM partenaire_service WHERE ID_PARTENAIRE_SERVICE=?", [ID_PARTENAIRE_SERVICE]))[0]
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Update partenaires",
            result: partenireUpdat
        })
    } catch (error) {
        console.log(error)
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: "Erreur interne du serveur, réessayer plus tard"
        })
    }
}

/**
 * fonction pour recuperer les services a la personne
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 30/1/2023
 * @param {*} req 
 * @param {*} res 
 */
const getServicePersonne = async (req, res) => {

    try {
              const getImageUri = (fileName) => {
                        if (!fileName) return null
                        if (fileName.indexOf("http") === 0) return fileName
                        return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`
              }
              const {ID_SERVICE_CATEGORIE} = req.params
              const servicePersonne = await userPartenaireModel.getServcePersonne(ID_SERVICE_CATEGORIE)
              res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "Liste service a la personne",
                        result: servicePersonne
              })
    } catch (error) {
              console.log(error)
              res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                        statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                        httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                        message: "Erreur interne du serveur, réessayer plus tard"
              })
    }
}
module.exports = {

    login,
    createUser,
    getAllPartenaire,
    getOnePartenaire,
    findByIdPartenaire,
    getcategories,
    createPartenaire,
    getProduits,
    findAll,
    findAllShop,
    UpdateShop,
    findAllResto,
    UpdatePartenaire,
    createLivreur,
    getServicePersonne
}