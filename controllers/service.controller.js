
const serviceModel = require('../models/service.model')
const Validation = require('../class/Validation')
const jwt = require("jsonwebtoken");
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const generateToken = require('../utils/generateToken');
const PartenaireUpload = require("../class/uploads/PartenaireUpload");
const path = require("path");
const { query } = require('../utils/db');
const getReferenceCode = require('../utils/getReferenceCode');
const express = require('express')

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

                    const service = await serviceModel.findById(req.userId, ID_SERVICE)
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

/**
 * Permet de trouver les services d'un partenaire
 * @param { express.Request } req 
 * @param { express.Response } res 
 */
const findPartenaireServices = async (req, res) => {
          try {
                    const { ID_PARTENAIRE } = req.params
                    const services = await serviceModel.findPartenaireServices(ID_PARTENAIRE)
                    res.status(RESPONSE_CODES.OK).json({
                              statusCode: RESPONSE_CODES.OK,
                              httpStatus: RESPONSE_STATUS.OK,
                              message: "succès",
                              result: services
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

const paye = async (req, res) => {
          try {
                    const { ID_PARTENAIRE_SERVICE, NUMERO, ID_SERVICE } = req.body
                    const CODE_UNIQUE = await getReferenceCode()

                    const payement = await serviceModel.createOne(ID_PARTENAIRE_SERVICE, ID_SERVICE, 1, NUMERO, CODE_UNIQUE)
                    res.status(RESPONSE_CODES.OK).json({
                              statusCode: RESPONSE_CODES.OK,
                              httpStatus: RESPONSE_STATUS.OK,
                              message: "succès",
                              result: payement
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
          paye,
          findAllService,
          findOne,
          findPartenaireServices
}

















