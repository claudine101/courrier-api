const RESPONSE_CODES = require('../constants/RESPONSE_CODES')
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS')
const partenairetypemodel=require('../models/partenaire.type.model')
const getAllPartenaireType = async (req, res) => {
    try {
              const partenairetype = await partenairetypemodel.findAll()
              res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "succès",
                        result: partenairetype
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
    getAllPartenaireType,
}