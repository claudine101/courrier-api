const express = require('express')
const resaturantRepascontroller = require('../controllers/restaurant.repas.controller')
const resaturantRepasRouter = express.Router()
resaturantRepasRouter.post('/create', resaturantRepascontroller.createRepas)
module.exports = resaturantRepasRouter