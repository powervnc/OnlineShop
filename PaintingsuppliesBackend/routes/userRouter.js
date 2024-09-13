const userController=require("../controllers/userController");
const router=require('express').Router()
const middleware=require("../middleware/authJwt");

const verifyToken=middleware.verifyToken;
const isAdmin=middleware.isAdmin;
router.get("/notAdminUsers",verifyToken,isAdmin,userController.getAllUsersNotAdmins);
router.patch("/updateRoleToUser",verifyToken,isAdmin,userController.BecomeUser);
router.patch("/updateRoleToModerator",verifyToken,isAdmin,userController.BecomeModerator);
router.delete("/deleteUser",verifyToken,isAdmin,userController.deleteUser);
router.patch("/addPoints",verifyToken,userController.addPointsToUser);
router.get("/getPoints",verifyToken,userController.getPoints);
module.exports=router;