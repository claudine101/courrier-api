const partenaireModel = require('../models/partenaire.model')
const UserUpload = require("../class/uploads/UserUpload")

const Validation = require('../class/Validation')
const jwt = require("jsonwebtoken");
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const generateToken = require('../utils/generateToken');
const path = require("path");
const { query } = require('../utils/db');
const { constants } = require('fs/promises');
const IDS_SERVICE_CATEGORIES = require('../constants/IDS_SERVICE_CATEGORIES');
const createPartenaire = async (req, res) => {
          try {
                    const { NOM, PRENOM, EMAIL,
                              USERNAME, PASSWORD, ID_PROFIL,
                              SEXE, DATE_NAISSANCE, COUNTRY_ID,
                              ADRESSE, TELEPHONE_1, TELEPHONE_2,
                              ID_TYPE_PARTENAIRE,
                              NOM_ORGANISATION,
                              ID_SERVICE,
                              PARTENAIRE_SERVICE_STATUT_ID,
                    } = req.body
                    const { IMAGE } = req.files || {}

                    const validation = new Validation(
                              { ...req.body, ...req.files },
                              {
                                        IMAGE: {
                                                  required: true,
                                                  image: 21000000
                                        },
                                        NOM:
                                        {
                                                  required: true,
                                        },
                                        PRENOM:
                                        {
                                                  required: true,
                                        },
                                        // EMAIL: "required,email",
                                        EMAIL: {
                                                  required: true,
                                                  email: true,
                                                  unique: "users,EMAIL"
                                        },
                                        PASSWORD:
                                        {
                                                  required: true,
                                        },
                                        ID_PROFIL:
                                        {
                                                  exists: "profils,ID_PROFIL",
                                        },
                                        SEXE:
                                        {
                                                  required: true,
                                        },
                                        DATE_NAISSANCE:
                                        {
                                                  required: true,
                                        },
                                        COUNTRY_ID:
                                        {
                                                  required: true,
                                        }
                                        ,
                                        ADRESSE: {
                                                  required: true,
                                        },
                                        TELEPHONE_1:
                                        {
                                                  required: true,
                                        },
                                        TELEPHONE_2:
                                        {
                                                  required: true,
                                        },
                                        ID_TYPE_PARTENAIRE:
                                        {
                                                  exists: "partenaires_types,ID_PARTENAIRE_TYPE",
                                        },
                                        ID_SERVICE:
                                        {
                                                  exists: "services,ID_SERVICE",

                                        },
                                        PARTENAIRE_SERVICE_STATUT_ID:
                                        {
                                                  exists: "partenaire_service_statut,ID_PARTENAIRE_SERVICE_STATUT",

                                        }

                              },
                              {
                                        IMAGE: {
                                                  required: "image est obligatoire",
                                                  image: "taille invalide"
                                        },
                                        NOM:
                                        {
                                                  required: "Nom d'un utilisateur   est obligatoire",
                                        },
                                        PRENOM:
                                        {
                                                  required: "Nom d'un utilisateur   est obligatoire",
                                        },
                                        EMAIL:
                                        {
                                                  unique: "email est  déjà utilisé",
                                                  email: "email est invalide",
                                                  required: "Email d'un utilisateur   est obligatoire",
                                        },
                                        PASSWORD:
                                        {
                                                  required: "passowrd d'un utilisateur   est obligatoire",
                                        },
                                        ID_PROFIL:
                                        {
                                                  // required: "profil d'un utilisateur   est obligatoire",
                                                  exists: "profil  est incorerect",
                                        },

                                        SEXE:
                                        {
                                                  required: "Sexe  est obligatoire",
                                        },
                                        DATE_NAISSANCE:
                                        {
                                                  required: "Date de naissance  est obligatoire",
                                        },
                                        COUNTRY_ID:
                                        {
                                                  required: "country  est obligatoire",
                                        },
                                        ADRESSE:
                                        {
                                                  required: "Adresse  est obligatoire",
                                        },
                                        TELEPHONE_1:
                                        {
                                                  required: "téléphone  est obligatoire",
                                        },
                                        TELEPHONE_2:
                                        {
                                                  required: "téléphone  est obligatoire",
                                        },
                                        ID_TYPE_PARTENAIRE:
                                        {
                                                  exists: "type partenaire  est invalide",
                                        },
                                        ID_SERVICE:
                                        {
                                                  exists: "service  est invalide",
                                        },
                                        PARTENAIRE_SERVICE_STATUT_ID:
                                        {
                                                  exists: "service partenaire  est invalide",
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
                    const userUpload = new UserUpload()
                    const { fileInfo, thumbInfo } = await userUpload.upload(IMAGE, false)

                    const { insertId: insertUser } = await partenaireModel.createUser(
                              NOM,
                              PRENOM,
                              EMAIL,
                              USERNAME,
                              PASSWORD,
                              ID_PROFIL,
                              SEXE,
                              DATE_NAISSANCE,
                              COUNTRY_ID,
                              ADRESSE,
                              TELEPHONE_1,
                              TELEPHONE_2,
                              fileInfo.fileName
                    )
                    const { insertId: insertPartenaire } = await partenaireModel.createPartenaire(
                              insertUser,
                              ID_TYPE_PARTENAIRE,
                              NOM_ORGANISATION
                    )
                    const { insertId: insertService } = await partenaireModel.createService(
                              insertPartenaire,
                              ID_SERVICE,
                              PARTENAIRE_SERVICE_STATUT_ID
                    )

                    const user = (await partenaireModel.findById(insertUser))[0]

                    res.status(RESPONSE_CODES.CREATED).json({
                              statusCode: RESPONSE_CODES.CREATED,
                              httpStatus: RESPONSE_STATUS.CREATED,
                              message: "Enregistrement est fait avec succès",
                              result: user
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
const findByService = async (req, res) => {
          const { id } = req.params
          try {
                    const getImageUri = (fileName, folder) => {
                              if (!fileName) return null
                              if (fileName.indexOf("http") === 0) return fileName
                              return `${req.protocol}://${req.get("host")}/uploads/${folder}/${fileName}`
                    }

                    const Allservice = await partenaireModel.findByService(id)
                    const products = Allservice.map(product => ({
                              ...product,
                              IMAGE: getImageUri(product.IMAGE, "users"),
                              LOGO: getImageUri(product.LOGO, "partenaire")
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

const getAllPartenaireServices = async (req, res) => {
          try {
                    const getImageUri = (fileName) => {
                              if (!fileName) return null
                              if (fileName.indexOf("http") === 0) return fileName
                              return `${req.protocol}://${req.get("host")}/uploads/partenaire/${fileName}`
                    }
                    var sqlQuery = "SELECT ps.*, s.NOM NOM_SERVICE FROM partenaire_service ps "
                    sqlQuery += " LEFT JOIN partenaires p ON p.ID_PARTENAIRE = ps.ID_PARTENAIRE "
                    sqlQuery += " LEFT JOIN services s ON s.ID_SERVICE = ps.ID_SERVICE "
                    sqlQuery += " WHERE p.ID_USER  = ? AND  ps.ID_SERVICE =2 "
                    const svs = await query(sqlQuery, [req.userId])
                    const services = svs.map(service => ({
                              ...service,
                              LOGO: getImageUri(service.LOGO),
                              BACKGROUND_IMAGE: getImageUri(service.BACKGROUND_IMAGE)
                    }))
                    res.status(RESPONSE_CODES.OK).json({
                              statusCode: RESPONSE_CODES.OK,
                              httpStatus: RESPONSE_STATUS.OK,
                              message: "Liste des services du partenaire",
                              result: services
                    })
          } catch (error) {
                    console.log(error)
                    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                              statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                              httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                              message: "echoue",

                    })
          }
}
const getOneServices = async (req, res) => {
          try {
                    const { ID_PARTENAIRE_SERVICE } = req.params
                    const getImageUri = (fileName) => {
                              if (!fileName) return null
                              if (fileName.indexOf("http") === 0) return fileName
                              return `${req.protocol}://${req.get("host")}/uploads/partenaire/${fileName}`
                    }
                    var sqlQuery = "SELECT ps.*, s.NOM NOM_SERVICE FROM partenaire_service ps "
                    sqlQuery += " LEFT JOIN partenaires p ON p.ID_PARTENAIRE = ps.ID_PARTENAIRE "
                    sqlQuery += " LEFT JOIN services s ON s.ID_SERVICE = ps.ID_SERVICE "
                    sqlQuery += " WHERE p.ID_USER  = ? AND  ps.ID_SERVICE =2  AND ID_PARTENAIRE_SERVICE=?"
                    const svs = await query(sqlQuery, [req.userId])
                    const services = svs.map(service => ({
                              ...service,
                              LOGO: getImageUri(service.LOGO),
                              BACKGROUND_IMAGE: getImageUri(service.BACKGROUND_IMAGE)
                    }))
                    res.status(RESPONSE_CODES.OK).json({
                              statusCode: RESPONSE_CODES.OK,
                              httpStatus: RESPONSE_STATUS.OK,
                              message: "Liste des services du partenaire",
                              result: services
                    })
          } catch (error) {
                    console.log(error)
                    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                              statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                              httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                              message: "echoue",

                    })
          }
}
const getAllPartenaire = async (req, res) => {
          try {
                    var binds = []
                    const { resto, lat, long, q, offset, limit } = req.query
                    var sqlQuery = "SELECT ps.* "
                    if (lat && long) {
                              sqlQuery += `,( 6371 * acos( cos( radians(${lat}) ) * cos( radians( ps.LATITUDE ) ) * cos( radians(ps.LONGITUDE) - radians(${long})) + sin(radians(${lat})) * sin( radians(ps.LATITUDE)))) AS DISTANCE `
                    }
                    sqlQuery += " FROM partenaire_service ps "
                    sqlQuery += ` WHERE   ps.ID_SERVICE = ${IDS_SERVICE_CATEGORIES.resto}  `
                    if (lat && long) {
                              sqlQuery += " ORDER BY DISTANCE ASC "
                    } else {
                              sqlQuery += " ORDER BY ps.DATE_INSERTION "
                    }
                    const services = await query(sqlQuery, binds)
                    res.status(RESPONSE_CODES.OK).json({
                              statusCode: RESPONSE_CODES.OK,
                              httpStatus: RESPONSE_STATUS.OK,
                              message: "Liste des s du partenaire",
                              result: services
                    })
          } catch (error) {
                    console.log(error)
                    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                              statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                              httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                              message: "echoue",

                    })
          }
}

module.exports = {
          createPartenaire,
          findByService,
          getAllPartenaireServices,
          getOneServices,
          getAllPartenaire
}