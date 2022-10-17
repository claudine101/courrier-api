const express = require('express')
const wishlistcontroller = require('../controllers/wishlist.controller')
const  wishlistRouter = express.Router()

wishlistRouter.post('/', wishlistcontroller.create)
// wishlistRouter.get('/', wishlistcontroller.createUser)
module.exports = wishlistRouter