const express = require('express')
const userPartenairecontroller = require('../controllers/user.partenaire.controller')
const userPartenaireRouter = express.Router()

userPartenaireRouter.post('/login', userPartenairecontroller.login)
userPartenaireRouter.post('/', userPartenairecontroller.createUser)

module.exports = userPartenaireRouter