
const serviceModel = require('../models/service.model')
const Validation = require('../class/Validation')
const jwt = require("jsonwebtoken");
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const generateToken = require('../utils/generateToken');
const path = require("path");
const findAllService = async (req, res) => {
          try {
                    const service = await serviceModel.findAll()
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
                              message: "Erreur interne du serveur, réessayer plus tard",


                    })
          }
}
const findOne = async (req, res) => {
    try {
        const { ID_SERVICE } = req.params

              const service = await serviceModel.findById(req.userId,ID_SERVICE)
              res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "succès",
                        result: service.length
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

const findService = async (req, res) => {
    try {
        const { ID_PARTENAIRE } = req.params
              const service = await serviceModel.findByIdPart(req.userId)
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
                        message: "Erreur interne du serveur, réessayer plus tard",


              })
    }
}
module.exports = {
          findAllService,
          findOne,
          findService
}

















