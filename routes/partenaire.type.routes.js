const express=require("express")
const partenairetypecontroller=require("../controllers/partenaire.type.controller")
const partenaireTypeRouter=express.Router()

partenaireTypeRouter.get('/',partenairetypecontroller.getAllPartenaireType)
module.exports=partenaireTypeRouter