
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
const serviceRouter = require('../routes/service.routes');
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

const findService = async (req, res) => {
    try {
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/partenaire/${fileName}`
        }
        const { ID_PARTENAIRE } = req.params
        const partenaire = (await query('SELECT * FROM partenaires WHERE ID_USER = ?', [req.userId]))[0]
        const servicess = await serviceModel.findByIdPart(partenaire.ID_PARTENAIRE)
        const services = servicess.map(service=>({
            produit:{
                ID_SERVICE:service.ID_SERVICE,
                ID_PARTENAIRE_SERVICE:service.ID_PARTENAIRE_SERVICE,
                NOM_SERVICE:service.NOM_SERVICE,
                DESCRIPTION:service.DESCRIPTION,
                NOM_ORGANISATION:service.NOM_ORGANISATION,
                TELEPHONE:service.TELEPHONE,
                NIF:service.NIF,
                ADDRESSE:service.ADRESSE_COMPLETE,
                OUVERT:service.OUVERT,
                PRESENTATION:service.PRESENTATION,
                EMAIL:service.EMAIL,
                LOGO:getImageUri(service.LOGO),
                BACKGROUND_IMAGE:getImageUri(service.BACKGROUND_IMAGE)
            }
        }))
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
const UpdateImage = async (req, res) => {
    try {
        const { ID_PARTENAIRE_SERVICE} = req.params
        const { IMAGE } = req.files || {}
        const getImageUri = (fileName) => {
            if (!fileName) return null
            if (fileName.indexOf("http") === 0) return fileName
            return `${req.protocol}://${req.get("host")}/uploads/partenaire/${fileName}`
        }
        const partenaireUpload = new PartenaireUpload()
        const { fileInfo, thumbInfo } = await partenaireUpload.upload(IMAGE, false)
        const { insertId: insertMenu } = await serviceModel.updateImage(
            fileInfo.fileName,
            ID_PARTENAIRE_SERVICE
        )
        const partenaireUpdate = await query("SELECT LOGO FROM partenaire_service WHERE ID_PARTENAIRE_SERVICE=? ", [ID_PARTENAIRE_SERVICE])
        const imageUpdate = partenaireUpdate.map(update => ({
            LOGO: getImageUri(update.LOGO),
        }))
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_CODES.OK,
            message: "Update des menu est faites avec succes",
            result: imageUpdate
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

      const payement=  await serviceModel.createOne(ID_PARTENAIRE_SERVICE,ID_SERVICE, 1, NUMERO, CODE_UNIQUE)
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
    UpdateImage,
    findService
}

















