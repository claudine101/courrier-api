const approvisionnementModel = require('../Models/approvisionnement.model')
const Validation = require('../class/Validation')
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const generateToken = require('../utils/generateToken');
    const  createApprovisionne= async (req, res) => {
    try {
        const { 
            ID_PRODUIT_STOCK,
            QUANTITE_APPROVISIONNER,
        } = req.body

        const validation = new Validation(req.body)
        await validation.run();
        const isValide = await validation.isValidate()
        if (!isValide) {
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: "Probleme de validation des donnees",
                result: errors
            })

        }
        const prod= (await approvisionnementModel.findById(ID_PRODUIT_STOCK))[0]
        const { insertId} = await approvisionnementModel.createApprovisionne(
            ID_PRODUIT_STOCK,
            prod.QUANTITE_STOCKE-prod.QUANTITE_VENDUE,
            QUANTITE_APPROVISIONNER,
            prod.QUANTITE_RESTANTE+QUANTITE_APPROVISIONNER,
        )
      await approvisionnementModel.update(
        prod.QUANTITE_RESTANTE+QUANTITE_APPROVISIONNER,
            prod.QUANTITE_RESTANTE+QUANTITE_APPROVISIONNER,
            ID_PRODUIT_STOCK
        )
       
        const produit = (await approvisionnementModel.findById(insertId))[0]
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