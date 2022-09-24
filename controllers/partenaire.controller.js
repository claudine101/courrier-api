const partenaireModel = require('../models/partenaire.model')
const UserUpload = require("../class/uploads/UserUpload")

const Validation = require('../class/Validation')
const jwt = require("jsonwebtoken");
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const generateToken = require('../utils/generateToken');
const path = require("path");
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
            { IMAGE: {
                required:"image est obligatoire",
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
                    unique:"email est  déjà utilisé",
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
const findByService=async(req,res)=>{
    const { id} = req.params
    console.log(id)

    try {
    
        const service = await partenaireModel.findByService(id)
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
    createPartenaire,
    findByService
}