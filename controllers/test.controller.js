const UserUpload = require("../class/uploads/UserUpload")
const Validation = require("../class/Validation")
const RESPONSE_CODES = require("../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../constants/RESPONSE_STATUS")
const { query } = require("../utils/db")

const test = async (req, res) => {
          try {
                    const { image } = req.files || { }
                    const validation = new Validation(req.files, {
                              image: {
                                        required: true,
                                        image: 21000000
                              }
                    })
                    await validation.run()
                    const isValid = await validation.isValidate()
                    const errors = await validation.getErrors()
                    if(!isValid) {
                              return res.status(RESPONSE_CODES.CREATED).json({
                                        statusCode: RESPONSE_CODES.CREATED,
                                        httpStatus: RESPONSE_STATUS.CREATED,
                                        message: "Problème de validation des données",
                                        result: errors
                              })
                    }
                    const userUpload = new UserUpload()
                    const { fileInfo, thumbInfo } = await userUpload.upload(image, false)
                    fileInfo.fileName
                    res.status(RESPONSE_CODES.CREATED).json({
                              statusCode: RESPONSE_CODES.CREATED,
                              httpStatus: RESPONSE_STATUS.CREATED,
                              message: "L'image est bien enregistré",
                              result: {
                                        fileInfo, thumbInfo
                              }
                    })
          } catch (error) {
                    console.log(error)
                    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                              statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                              httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                              message: "Erreur interne du serveur, réessayer plus tard"
                    })
          }
}

module.exports = {
          test
}