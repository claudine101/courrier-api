const approvisionnementModel = require('../Models/approvisionnement.model')
const Validation = require('../class/Validation')
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const generateToken = require('../utils/generateToken');
const createApprovisionne = async (req, res) => {
    try {
        const {
            ID_PRODUIT_STOCK,
            QUANTITE_APPROVISIONNER,
        } = req.body

        const validation = new Validation(
            req.body,
            {
                QUANTITE_APPROVISIONNER: 
                {
                    length:[0,1],
                    required: true,
                },
                ID_PRODUIT_STOCK:
                {
                    exists: "ecommerce_produit_stock,ID_PRODUIT_STOCK",
                },

            },
            {
                QUANTITE_APPROVISIONNER:
                {
                    required: "Quantite est obligatoire",
                },
                ID_PRODUIT_STOCK:
                {
                    exists: "produit  invalide",
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
        const prod = (await approvisionnementModel.findById(ID_PRODUIT_STOCK))[0]
        const { insertId } = await approvisionnementModel.createApprovisionne(
            ID_PRODUIT_STOCK,
            parseInt(prod.QUANTITE_STOCKE) - parseInt(prod.QUANTITE_VENDUE),
            QUANTITE_APPROVISIONNER,
            parseInt(prod.QUANTITE_RESTANTE) + parseInt(QUANTITE_APPROVISIONNER),

        )
        await approvisionnementModel.update(
            parseInt(prod.QUANTITE_RESTANTE) + parseInt(QUANTITE_APPROVISIONNER),
            parseInt(prod.QUANTITE_RESTANTE) + parseInt(QUANTITE_APPROVISIONNER),
            ID_PRODUIT_STOCK
        )

        const produit = (await approvisionnementModel.findByIde(insertId))[0]
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

module.exports = {
    createApprovisionne,
}