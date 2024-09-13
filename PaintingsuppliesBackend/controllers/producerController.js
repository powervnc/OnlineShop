
const db=require("../models")
const Producer = db.producers;
const utils= require('../utils')
const validatorProducer=utils.validators.validateProducer;

const  generateNewIdProducer=async()=> {
  const count = await Producer.count();
 return  1+ count;
}

const addProducer= async (req, res) => {
  const nameProducer=req.body.nameProducer
    const producer = {
      nameProducer: nameProducer,
    };

    if (validatorProducer(producer)) {
      await db.sequelize.sync();
      const p = await Producer.create({
        nameProducer: nameProducer,
      });
  
      let producersDatabase = await Producer.findAll({ raw: true });
      res.json(producersDatabase);
    } else {
      res.status(400).json({ message: "Supply data is wrong" });
    }
  }


const getAllProducers=async (req, res) => {
    const allProducers = await Producer.findAll({ raw: true });
    res.json(allProducers);
}

const getProducerById=async (req, res) => {
    const id = parseInt(req.query.id);
    const producer = await Producer.findOne({ where: { idProducer: id } });
    res.json(producer);
  }
const updateProducer=async (req, res) => {
    const producer = {
      idProducer: req.body.idProducer,
      nameProducer: req.body.nameProducer,
    };
    console.log(producer);
    if (validatorProducer(producer)) {
      await Producer.update(
        { nameProducer: producer.nameProducer },
        { where: { idProducer: producer.idProducer } }
      );
  
      let producersDatabase = await Producer.findAll({ raw: true });
      console.log("after update:",producersDatabase)
      //io.emit("changedTheProducers", producersDatabase);
      res.json(producersDatabase);
    } else {
      res.status(400).json({ message: "Supply data wrong" });
    }
}

const deleteProducer=async (req, res) => {
    const id = req.body.idProducer;
    let n = await Producer.destroy({ where: { idProducer: id } });
    console.log(`number of deleted rows: ${n}`); //must be 1
    let producersDatabase = await Producer.findAll({ raw: true });
    //io.emit("changedTheProducers", producersDatabase);
    res.json(producersDatabase);
  }



module.exports={
    addProducer,
    deleteProducer,
    updateProducer,
    getAllProducers,
    getProducerById
}


