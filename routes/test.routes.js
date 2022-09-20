const express = require('express')
const testConntroller = require('../controllers/test.controller.js')
const testRouter = express.Router()
testRouter.post('/', testConntroller.test)
module.exports = testRouter