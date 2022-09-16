const express=require('express')
const usercontroller=require('../controllers/user.controller')
const userRouter=express.Router()

userRouter.post('/login',usercontroller.login)
userRouter.post('/',usercontroller.createUser)
module.exports=userRouter