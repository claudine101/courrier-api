const userModel = require('../models/user.model')
const Validation = require('../class/Validation')
const jwt = require("jsonwebtoken");
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const generateToken = require('../utils/generateToken');
const UserUpload = require("../class/uploads/UserUpload")
const sendPushNotifications = require("../utils/sendPushNotifications")
const {query} = require("../utils/db")

const path = require("path");
const md5 = require('md5');

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

                              },  {
                                        password: {
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
                    var user = (await userModel.findBy("EMAIL", email))[0];
                    if (user && user.ID_PROFIL == 1) {
                              if (user.PASSWORD == md5(password)) {
                                        const notification = (await query('SELECT ID_NOTIFICATION_TOKEN FROM notification_tokens WHERE TOKEN = ? AND ID_USER = ?', [PUSH_NOTIFICATION_TOKEN, user.ID_USER]))[0]
                                        if (!notification && PUSH_NOTIFICATION_TOKEN) {
                                                await query('INSERT INTO notification_tokens(ID_USER, DEVICE, TOKEN, ID_PROFIL) VALUES(?, ?, ?, ?)', [user.ID_USER, DEVICE, PUSH_NOTIFICATION_TOKEN, user.ID_PROFIL]);
                                        }
                                        const token = generateToken({ user: user.ID_USER }, 3 * 12 * 30 * 24 * 3600)
                                        const { PASSWORD, USERNAME, ID_PROFIL, ...other } = user
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


                    }
                    else {
                              validation.setError('main', 'Identifiants incorrects')
                              const errors = await validation.getErrors()
                              res.status(RESPONSE_CODES.NOT_FOUND).json({
                                        statusCode: RESPONSE_CODES.NOT_FOUND,
                                        httpStatus: RESPONSE_STATUS.NOT_FOUND,
                                        message: "Utilisateur n'existe pas",
                                        result: errors
                              })
                    }


          }

          catch (error) {
                    console.log(error)
                    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                              statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                              httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                              message: "La connexion echoue Verifier les identifiants",

                    })

          }
}
const createUser = async (req, res) => {
          // const email = (await query("SELECT EMAIL FROM users WHERE 1"))
          // console.log(email)
          try {


                    const { NOM, PRENOM, EMAIL, USERNAME: email, PASSWORD: password, SEXE, DATE_NAISSANCE, COUNTRY_ID, ADRESSE, TELEPHONE_1, TELEPHONE_2, PUSH_NOTIFICATION_TOKEN, DEVICE } = req.body
                    const { IMAGE } = req.files || {}
                    const validation = new Validation({ ...req.body, ...req.files },
                              {
                                        IMAGE: {
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
                    if(IMAGE) {
                              const { fileInfo } = await userUpload.upload(IMAGE, false)
                              filename = fileInfo.fileName
                    }

                    const { insertId } = await userModel.createOne(
                              NOM,
                              PRENOM,
                              EMAIL,
                              email,
                              md5(password),
                              1,
                              SEXE,
                              DATE_NAISSANCE,
                              COUNTRY_ID,
                              ADRESSE,
                              TELEPHONE_1,
                              TELEPHONE_2,
                              filename ? filename : null
                    )
                    const user = (await userModel.findById(insertId))[0]
                    const token = generateToken({ user: user.ID_USER }, 3 * 12 * 30 * 24 * 3600)
                    const { PASSWORD, USERNAME, ID_PROFIL, ...other } = user
                    const notification = (await query('SELECT ID_NOTIFICATION_TOKEN FROM notification_tokens WHERE TOKEN = ? AND ID_USER = ?', [PUSH_NOTIFICATION_TOKEN, user.ID_USER]))[0]
                    if (!notification && PUSH_NOTIFICATION_TOKEN) {
                                await query('INSERT INTO notification_tokens(ID_USER, DEVICE, TOKEN, ID_PROFIL) VALUES(?, ?, ?, ?)', [user.ID_USER, DEVICE, PUSH_NOTIFICATION_TOKEN, user.ID_PROFIL]);
                        }
                    res.status(RESPONSE_CODES.CREATED).json({
                              statusCode: RESPONSE_CODES.CREATED,
                              httpStatus: RESPONSE_STATUS.CREATED,
                              message: "Enregistrement est fait avec succès",
                              result: {...other, token}
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
module.exports = {
          login,
          createUser,
}