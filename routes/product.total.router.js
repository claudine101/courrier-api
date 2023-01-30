const express = require('express')
const productTotalController = require("../controllers/products.total.controller")

const productTotalRouter = express.Router()
productTotalRouter.get('/vendus', productTotalController.countProduitVendus)
productTotalRouter.get('/', productTotalController.countProduit)
productTotalRouter.get('/notes', productTotalController.countNotesProduit)
productTotalRouter.get('/wishlist', productTotalController.countWishlist)

module.exports = productTotalRouter