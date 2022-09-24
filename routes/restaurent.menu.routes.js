const express = require('express')
const menucontroller = require('../controllers/restaurant.menu.controller')
const menuRouter = express.Router()
menuRouter.post('/create', menucontroller.createMenu)

module.exports = menuRouter