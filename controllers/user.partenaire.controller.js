const userModel = require('../models/user.partenaire.model')
const Validation = require('../class/Validation')
const PartenaireUpload = require("../class/uploads/PartenaireUpload")
const jwt = require("jsonwebtoken");
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const generateToken = require('../utils/generateToken');
const path = require("path");
const md5 = require('md5');
const UserUpload = require("../class/uploads/UserUpload")
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
        console.log(user)
        if (user) {
            if (user.PASSWORD == md5(password)) {
                const token = generateToken({ user: user.ID_USER }, 3600)
                const { PASSWORD, USERNAME, ID_PROFIL, IMAGE, ID_PARTENAIRE, ID_TYPE_PARTENAIRE, COUNTRY_ID, ...other } = user
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

    try {


        const { NOM, PRENOM, EMAIL, USERNAME, PASSWORD, SEXE, DATE_NAISSANCE, COUNTRY_ID, ADRESSE, TELEPHONE_1, TELEPHONE_2 } = req.body
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
        const { insertId } = await userModel.createOne(
            NOM,
            PRENOM,
            EMAIL,
            USERNAME,
            PASSWORD,
            2,
            SEXE,
            DATE_NAISSANCE,
            COUNTRY_ID,
            ADRESSE,
            TELEPHONE_1,
            TELEPHONE_2,
            filename ? filename : null
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
const createPartenaire = async (req, res) => {
    try {
        const { ID_USER, ID_TYPE_PARTENAIRE, NOM_ORGANISATION, TELEPHONE, NIF, EMAIL, ADRESSE_COMPLETE, LATITUDE, LONGITUDE } = req.body
        const { LOGO, BACKGROUND_IMAGE } = req.files || {}
        const validation = new Validation({ ...req.body, ...req.files },
            {


                LOGO: {
                    image: 21000000
                },
                BACKGROUND_IMAGE: {
                    image: 21000000
                },


            },
            {
                LOGO: {
                    IMAGE: "La taille invalide"
                },
                BACKGROUND_IMAGE: {
                    IMAGE: "La taille invalide"
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
       
        const { fileInfo: fileInfo_1, thumbInfo: thumbInfo_1 } = await partenaireUpload.upload(LOGO, false)
       const { fileInfo: fileInfo_2, thumbInfo: thumbInfo_2 } = await partenaireUpload.upload(BACKGROUND_IMAGE, false)
        

        
       

        const { insertId } = await userModel.createpartenaire(
            ID_USER,
            ID_TYPE_PARTENAIRE,
            NOM_ORGANISATION,
            TELEPHONE,
            NIF,
            EMAIL,
            fileInfo_1.fileName,
            fileInfo_2.fileName,
           
            ADRESSE_COMPLETE,
            LATITUDE,
            LONGITUDE,
            
            





        )
        const partenaire = (await userModel.findByIdPartenai(insertId))[0]
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Enregistrement est fait avec succès",
            result: partenaire
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
        const { category, subCategory, limit, offset } = req.query

        console.log(subCategory)
        const allPartenaire = await userModel.findpartenaire(category, subCategory, limit, offset)
        const partenaires = await Promise.all(allPartenaire.map(async partenaire => {
            const categorie = await userModel.findbycategorie(partenaire.ID_PARTENAIRE)
            return {
                ...partenaire,
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
const getcategories = async (req, res) => {
    try {
        const { ID_PARTENAIRE } = req.params
        const categories = await userModel.findcategories(ID_PARTENAIRE)
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

        const service = await userModel.findByIdPartenaire(id)
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
module.exports = {
    login,
    createUser,
    getAllPartenaire,
    findByIdPartenaire,
    getcategories,
    createPartenaire

}