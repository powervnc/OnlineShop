const authentificationController=require("../controllers/authentificationController")
const router=require('express').Router()
router.post('/signup',authentificationController.addUser,authentificationController.signupUser)
router.post('/login',authentificationController.findUser,authentificationController.loginUser)
router.post('/refreshToken',authentificationController.getNewTokenBasedOnRefreshToken)
router.post("/logout",authentificationController.logout)
module.exports=router