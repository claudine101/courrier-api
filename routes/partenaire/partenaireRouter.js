const express = require('express')
const partenaires_types_routes = require('./partenaires_types.routes')
const partenaire_service_routes = require('./partenaire_service.routes')
const partenaireRouter = express.Router()

partenaireRouter.use('/partenaire_service', partenaire_service_routes)
partenaireRouter.use('/partenaires_types', partenaires_types_routes)

module.exports = partenaireRouter