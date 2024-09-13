const producerController=require("../controllers/producerController")
const router=require('express').Router()
router.post('/addProducer',producerController.addProducer)
router.get('/getProducers',producerController.getAllProducers)
router.get('/getProducerById',producerController.getProducerById)
router.patch('/updateProducer',producerController.updateProducer)
router.delete('/deleteProducer',producerController.deleteProducer)
module.exports=router