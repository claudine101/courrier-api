const restaurantRepasModel = require('../models/restaurant.repas.model')
const Validation = require('../class/Validation')
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const createRepas = async (req, res) => {
    try {
        const {
            ID_PARTENAIRE,
            ID_TYPE_REPAS,
            DESCRIPTION,
            DESCRIPTION_FOURNISSEUR,
        } = req.body
        const validation = new Validation(
            req.body,
            {
                ID_PARTENAIRE:
                {
                    exists: "partenaires,ID_PARTENAIRE",
                },
                ID_TYPE_REPAS:
                {
                    exists: "restaurant_type_repas,ID_TYPE_REPAS",
                },
                DESCRIPTION:
                {
                    required: true,
                },
                DESCRIPTION_FOURNISSEUR:
                {
                    required: true,
                }
            },
            {
                ID_PARTENAIRE:
                {
                    exists: "partenaire  invalide",
                },
                ID_TYPE_REPAS:
                {
                    exists: "type de repas invalide",
                },
                DESCRIPTION:
                {
                    required: "description d'un produit  est obligatoire",
                },
                DESCRIPTION_FOURNISSEUR:
                {
                    required: "description dun fournisseur   est obligatoire",
                }
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
        const { insertId} = await restaurantRepasModel.createOne(
            ID_PARTENAIRE,
            ID_TYPE_REPAS,
            DESCRIPTION,
            DESCRIPTION_FOURNISSEUR,
        )
        const repas = (await restaurantRepasModel.findById(insertId))[0]
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Enregistrement est fait avec succès",
            result: repas
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
    createRepas,
}