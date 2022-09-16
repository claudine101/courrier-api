const userModel = require('../Models/user.model')
const Validation = require('../class/Validation')
const jwt = require("jsonwebtoken");
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const generateToken = require('../utils/generateToken');
const path = require("path");
const login = async (req, res) => {

    try {
        const { email, password } = req.body;

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
        //console.log('Hello')
        var user = (await userModel.findBy("EMAIL", email))[0];

        if (user) {
            if (user.PASSWORD == password) {
                const token = generateToken({ user: user.USER_ID }, 3600)
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


        const { NOM, PRENOM, EMAIL, USERNAME, PASSWORD, ID_PROFIL, SEXE, DATE_NAISSANCE, COUNTRY_ID, ADRESSE, TELEPHONE_1, TELEPHONE_2 } = req.body

        const validation = new Validation(req.body,
            {
                EMAIL: "required,email",

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
                USERNAME:
                {
                    required: true,
                },
                PASSWORD:
                {
                    required: true,
                },
                ID_PROFIL:
                {
                    required: true,
                },
            },
            {
                NOM: {
                    required: "Le nom est obligatoire"
                },
                PRENOM: {
                    required: "Le prenom est obligatoire"
                },
                EMAIL: {
                    required: "L'email est obligatoire",
                    email: "Invalide email"
                },
                PASSWORD: {
                    required: "Le mot de passe est obligatoire"
                },
                USERNAME: {
                    required: "Le nom d'utilisateur est obligatoire"
                },
                ID_PROFIL: {
                    required: "L'id du profil est obligatoire"
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
        const { insertId } = await userModel.createOne(
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
            //IMAGE
        )
        const user = (await userModel.findById(insertId))[0]
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
module.exports = {
    login,
    createUser,
}