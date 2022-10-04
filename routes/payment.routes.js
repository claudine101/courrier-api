const express = require("express")
const { confirmEconet } = require("../controllers/payment.controller")

const paymentRouter =express.Router()
paymentRouter.get('/confirm_ecocash/:txni_d', confirmEconet)
module.exports =paymentRouter
