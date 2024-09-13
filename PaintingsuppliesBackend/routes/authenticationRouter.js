const authenticationController=require("../controllers/authentificationController")
const router=require('express').Router()
router.post('/signup',authenticationController.addUser,authenticationController.signupUser)
router.post('/login',authenticationController.findUser,authenticationController.loginUser)
router.post("/resetPassword",authenticationController.resetPassword);
router.post('/refreshToken',authenticationController.getNewTokenBasedOnRefreshToken)
router.post("/logout",authenticationController.logout)

module.exports=router