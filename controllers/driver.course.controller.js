const driverCourseModel = require('../models/driver.course.model')
const Validation = require('../class/Validation')
const RESPONSE_CODES = require('../constants/RESPONSE_CODES');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS');
const { query } = require('../utils/db');
const createCourse = async (req, res) => {
        try {
             const {
                        ID_CATEGORIE_COURSE,
                        CODE_UNIQUE,
                        ADDRESSE_PICKER,
                        LALTITUDE_PICKER,
                        LONGITUDE_PICKER,
                        ID_STATUS_COURSE,
                    } = req.body
            const validation = new Validation(req.body,
                        {    
                            ID_CATEGORIE_COURSE:
                                {
                                        required: true,
                                        exists: "driver_course_catego,ID_CATEGORIE_COURSE",        
                                },
                                CODE_UNIQUE:
                                {
                                        required: true,
                                        exists: "ecommerce_commandes,CODE_UNIQUE",        
                                },
                                ADDRESSE_PICKER:
                                {
                                        required: true,
                                        length: [0, 255]
                                },
                                LALTITUDE_PICKER:
                                {
                                        required: true,
                                        length: [0, 255]
                                },

                                LONGITUDE_PICKER:
                                {
                                        required: true,
                                        length: [0, 255]
                                },
                                ID_STATUS_COURSE:
                                {
                                    required: true,
                                    exists: "driver_statut_course,ID_STATUS_COURSE",        
                            
                                },

                        },
                        {
                            ID_CATEGORIE_COURSE:
                            {
                                    required: "categorie d'une course est obligatoire",
                                    exists: "categorie d'une course invalide",        
                            },
                            CODE_UNIQUE:
                            {
                                    required: "code unique est obligatoire",
                                    exists: "code unique est invalide",        
                            },
                            ADDRESSE_PICKER:
                            {
                                    required: "addresse picker est obligatoire",
                                    length: "addresse picker est trop longueur  "
                            },
                            LALTITUDE_PICKER:
                            {
                                required: "latitude picker est obligatoire",
                                length: "latitude picker est trop longueur  "
                            },

                            LONGITUDE_PICKER:
                            {
                                required: "longitude picker est obligatoire",
                                length: "longitude picker est trop longueur  "
                            },
                            ID_STATUS_COURSE:
                            {
                                required: "statut d'une course est obligatoire",
                                    exists: "statut d'une course invalide",          
                            },

                        }
                )
                    const statut = (await query("SELECT STATUT_LIVRAISON FROM ecommerce_commandes WHERE CODE_UNIQUE=?", [CODE_UNIQUE]))[0]
                    
                    if (statut.STATUT_LIVRAISON==1) {
                            await validation.setError(`code ${statut.STATUT_LIVRAISON}`, 'est déjà livré')
                    }
            
                await validation.run()
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

                const { insertId } = await driverCourseModel.createOne(
                    ID_CATEGORIE_COURSE,
                    CODE_UNIQUE,
                    ADDRESSE_PICKER,
                    LALTITUDE_PICKER,
                    LONGITUDE_PICKER,
                    ID_STATUS_COURSE,
                    req.userId
                )
                await driverCourseModel.updateOne(CODE_UNIQUE)
                 const course = (await driverCourseModel.findbyId(insertId))[0]
                res.status(RESPONSE_CODES.OK).json({
                        statusCode: RESPONSE_CODES.OK,
                        httpStatus: RESPONSE_STATUS.OK,
                        message: "enregistrement reussi avec Succès",
                        result: course
                })
        }
        catch (error) {
                console.log(error)
                res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
                        statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
                        httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
                        message: "Erreur interne du serveur, réessayer plus tard"
                })
        }
}



module.exports = {
    createCourse
}