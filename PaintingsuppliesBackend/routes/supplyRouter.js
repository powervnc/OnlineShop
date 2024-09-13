//TO DO : get for pages and nr 
const supplyController=require("../controllers/supplyController")
const router=require('express').Router()
const middleware=require("../middleware/authJwt")
const verifyToken=middleware.verifyToken;
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const isAdmin=middleware.isAdmin;
//const isModerator=middleware.isModerator;
const isModeratorOrAdmin=middleware.isModeratorOrAdmin;
// ,verifyToken,isModeratorOrAdmin,
router.post('/addSupply',verifyToken,isModeratorOrAdmin,supplyController.addSupply)
router.get('/api1',verifyToken,supplyController.getAllSupplies)
router.get('/api3',supplyController.getSupplyById)
router.patch('/pages',verifyToken,supplyController.getAllSuppliesProduced)
router.patch('/nrSuppliesProduced',verifyToken,supplyController.getTheNrSuppliedProducedBy);
router.patch('/updateSupply',verifyToken,isModeratorOrAdmin,supplyController.updateSupply)
router.delete('/api4',verifyToken,isModeratorOrAdmin,supplyController.deleteSupply)
router.get("/health-check",supplyController.healthCheck);
router.post("/placeOrders",verifyToken,supplyController.placeOrders);
module.exports=router

