const express = require('express')
const driverCoursecontroller = require('../controllers/driver.course.controller')
const driverCourseRouter = express.Router()
driverCourseRouter.post('/create', driverCoursecontroller.createCourse)
module.exports = driverCourseRouter