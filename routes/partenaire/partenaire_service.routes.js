const express = require('express')
const partenaire_service_controller = require('../../controllers/partenaire/partenaire_service.controller')

const partenaire_service_routes = express.Router()

partenaire_service_routes.get('/', partenaire_service_controller.findAll)
partenaire_service_routes.get('/:ID_PARTENAIRE', partenaire_service_controller.findPartenaireServices)
partenaire_service_routes.post('/', partenaire_service_controller.createPartenaireService)

module.exports = partenaire_service_routes