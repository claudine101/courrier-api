const wishlistModel = require('../models/wishlist.model')
const Validation = require('../class/Validation')
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const create = async (req, res) => {
    try {
        const {
            ID_PRODUIT_PARTENAIRE
        } = req.body
        const validation = new Validation(
            req.body,
            {
                
                ID_PRODUIT_PARTENAIRE:
                {
                    required: true,
                },
                
            },
            {
                ID_PRODUIT_PARTENAIRE:
                {
                    required: "partenaire  invalide",
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
        const { insertId} = await wishlistModel.createOne(
            ID_PRODUIT_PARTENAIRE,
            req.userId
        )
        const wishlist = (await wishlistModel.findById(insertId))[0]
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Enregistrement est fait avec succès",
            result: wishlist
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
    create,
}