const { response } = require("express");
const multer = require("multer");
const db = require("../models");
const Supply = db.supplies;
const Producer = db.producers;
const Orders = db.orders;
const Users = db.users;
const utils = require("../utils");
const validatorSupply = utils.validators.validateSupply;
const upload = require("./multerConfig");
const nodemailer = require("nodemailer");

///filtering based on selected producer
const getSuppliesPaged = async (page, producer, load_5, category) => {
  let pageSize = 50;
  let offset = (page - 1) * pageSize;
  console.log("category in paginated:", category);
  if (load_5) {
    pageSize = 5;
    offset = 50 + (page - 2) * pageSize;
  }
  const limit = pageSize;
  let query = `
    SELECT s.idSupply, s.nameSupply, s.priceSupply, s.nrOfSupplies,s.descriptionSupply, p.nameProducer,s.categorySupply,s.supplyImage
    FROM supplies s
    INNER JOIN producers p ON s.idProducer = p.idProducer
  `;
  const replacements = {
    limit: limit,
    offset: offset,
  };
  if (producer && producer !== "All Producers") {
    query += `
      WHERE p.nameProducer = :producer
    `;
    replacements.producer = producer;
  }
  if (category && category !== "All Categories") {
    query += ` AND s.categorySupply = :category `;
    replacements.category = category;
  }
  query += `
    LIMIT :limit OFFSET :offset;
  `;

  const suppliesDatabase = await db.sequelize.query(query, {
    replacements: replacements,
    type: db.sequelize.QueryTypes.SELECT,
  });

  return suppliesDatabase;
};

const generateNewIdSupply = async () => {
  const count = await Supply.count();
  console.log("Count inside add:", count);
  return count + 1;
};

const getIdProducer = async (nameProducer) => {
  const producer = await Producer.findOne({
    where: { nameProducer: nameProducer },
  });
  if (!producer) {
    return -1;
  }
  return producer.idProducer;
};

const addSupply = async (req, res) => {
  user = req.user;
  const page = req.body.page;
  const selectedProducer = req.body.selectedProducer;
  console.log("User in add :", user);
  const supply = {
    nameSupply: req.body.nameSupply,
    nameProducer: req.body.nameProducer,
    priceSupply: req.body.priceSupply,
    descriptionSupply: req.body.descriptionSupply,
    nrOfSupplies: req.body.nrOfSupplies,
    categorySupply: req.body.categorySupply,
  };
  console.log(supply);

  try {
    const validation = validatorSupply(supply);
    let errorMessages = validation.message;
    const idProducer = await getIdProducer(supply.nameProducer);
    if (idProducer === -1) {
      errorMessages = [...errorMessages, "Invalid producer"];
    }
    if (errorMessages.length > 0) {
      return res.status(400).json({ message: errorMessages });
    }

    const newSupply = {
      nameSupply: supply.nameSupply,
      descriptionSupply: supply.descriptionSupply,
      priceSupply: supply.priceSupply,
      idProducer: idProducer,
      nrOfSupplies: supply.nrOfSupplies,
      categorySupply: supply.categorySupply,
    };

    const createdSupply = await Supply.create(newSupply);

    let suppliesDatabase = await getSuppliesPaged(page, selectedProducer);

    res.json(suppliesDatabase);
  } catch (error) {
    console.error("Error adding supply:", error);
    res.status(500).json({ message: "Internal server error :", error });
  }
};
const getAllSupplies = async (req, res) => {
  user = req.user;
  let suppliesDatabase = await Supply.findAll({
    raw: true,
  });
  res.json(suppliesDatabase);
};

const getSupplyById = async (req, res) => {
  const id = parseInt(req.query.idSupply);
  const supply = await Supply.findOne({ where: { idSupply: id } });

  const producer = await Producer.findOne({
    where: { idProducer: supply.idProducer },
  });

  const sentSupply = {
    idSupply: supply.idSupply,
    nameSupply: supply.nameSupply,
    descriptionSupply: supply.descriptionSupply,
    priceSupply: supply.priceSupply,
    nameProducer: producer.nameProducer,
    categorySupply: supply.categorySupply,
  };

  return res.json(sentSupply);
};

const deleteSupply = async (req, res) => {
  const idSupply = req.body.id;
  const page = req.body.page;
  const producer = req.body.producer;
  let n = await Supply.destroy({ where: { idSupply: idSupply } });
  console.log(`number of deleted rows: ${n}`); //must be 1
  const suppliesDatabase = await getSuppliesPaged(page, producer);
  //io.emit("changedTheProducers", suppliesDatabase);
  res.json(suppliesDatabase);
};

const updateSupply = async (req, res) => {
  const {
    page,
    selectedProducer,
    idSupply,
    nameSupply,
    nameProducer,
    priceSupply,
    descriptionSupply,
    nrOfSupplies,
    categorySupply,
  } = req.body;

  const supply = {
    idSupply,
    nameSupply,
    nameProducer,
    priceSupply,
    descriptionSupply,
    nrOfSupplies,
    categorySupply,
  };

  console.log("Supply to update:", supply);

  try {
    const validation = validatorSupply(supply);
    let errorMessages = validation.message;
    const idProducer = await getIdProducer(supply.nameProducer);
    if (idProducer === -1) {
      errorMessages = [...errorMessages, "Invalid producer"];
    }
    if (errorMessages.length > 0) {
      return res.status(400).json({ message: errorMessages });
    }
    const [updated] = await Supply.update(
      {
        nameSupply: supply.nameSupply,
        descriptionSupply: supply.descriptionSupply,
        priceSupply: supply.priceSupply,
        idProducer: idProducer,
        nrOfSupplies: supply.nrOfSupplies,
        categorySupply: supply.categorySupply,
      },
      {
        where: { idSupply: supply.idSupply },
      }
    );
    if (!updated) {
      return res.status(404).json({ message: "Supply not found" });
    }
    const suppliesDatabase = await getSuppliesPaged(page, selectedProducer);

    console.log("paginated update:", suppliesDatabase);
    return res.json(suppliesDatabase);
  } catch (error) {
    console.error("Error updating supply:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getTheNrSuppliedProducedBy = async (req, res) => {
  let producer;
  try {
    producer = req.body.producer;
    category = req.body.category;

    let query = `
          SELECT count(*) as count
          FROM supplies s
          INNER JOIN producers p ON s.idProducer = p.idProducer
        `;

    if (producer && producer !== "All Producers") {
      query += `
            WHERE p.nameProducer = :producer
          `;
    }
    if (category && category !== "All Categories") {
      query += ` AND s.categorySupply = :category `;
    }

    countElements = await db.sequelize.query(query, {
      replacements: { producer: producer, category: category },
      type: db.sequelize.QueryTypes.SELECT,
    });
    res.status(200).json(countElements[0]);
  } catch (error) {
    console.error(
      `Error in getting how many supllies are produced by ${producer}`,
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllSuppliesProduced = async (req, res) => {
  try {
    const { producer, page, load_5, category } = req.body;
    console.log("Catgeory in all supplies pp:", category);
    if (!page) {
      return res.status(400).json({ message: "Invalid pagination" });
    }

    const supplies = await getSuppliesPaged(page, producer, load_5, category);
    res.status(200).json(supplies);
  } catch (error) {
    console.error("Error in getAllSuppliesProduced:", error);
    res.status(500).json({ message: "Internal server error: " + error });
  }
};

const healthCheck = (req, res) => {
  res.sendStatus(200);
};

const placeOrders = async (req, response) => {
  let message = "";
  let totalSumSpent = 0;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "marinamariaemiliana@gmail.com",
      pass: "uowi zaml lfqj aewp ",
    },
  });
  let mailOptions;
  try {
    const user = req.user;
    let existingUser = await Users.findOne({
      where: { username: user.username },
    });
    mailOptions = {
      from: "marinamariaemiliana@gmail.com",
      to: existingUser.email,
      subject: "Processed Purchase",
      text: "",
    };
    console.log("user in place orders:", user);
    const idUser = user.username;
    const foundUser = await Users.findOne({ where: { username: idUser } });
    const points = foundUser.points;
    console.log("username in place orders:", idUser);
    const cart = req.body.cart;
    console.log("cart in place orders:", cart);
    for (const element of cart) {
      const idSupply = element.idSupply;
      const quantity = element.quantity;
      const supply = await Supply.findOne({ where: { idSupply: idSupply } });

      if (!supply) {
        message =
          message + "The product has been discontinued. We are sorry:(\n";
      } else {
        const priceSupply = supply.priceSupply;
        const nrOfSupplies = supply.nrOfSupplies;
        if (nrOfSupplies == 0) {
          message = message + supply.nameSupply + " is not available\n";
        } else if (nrOfSupplies < quantity) {
          message =
            message +
            supply.nameSupply +
            ": not enought items. There are only " +
            nrOfSupplies +
            " items\n";
        } else {
          totalSumSpent += priceSupply * quantity;
          const order = {
            idUser: idUser,
            idSupply: element.idSupply,
            dateOrder: Date.now(),
            quantity: quantity,
          };
          Orders.create(order);
          console.log("after create order");
          Supply.update(
            {
              nrOfSupplies: supply.nrOfSupplies - quantity,
            },
            {
              where: { idSupply: supply.idSupply },
            }
          );
          mailOptions.text =
            mailOptions.text +
            `\nBought supply ${
              supply.nameSupply
            } ${quantity}-times in value of ${priceSupply * quantity} points (${
              priceSupply * quantity * 1.8
            } dollars)`;
          console.log("!!!POINTS:", points);
          Users.update(
            { points: points - priceSupply * quantity },
            {
              where: {
                username: idUser,
              },
            }
          );
        }
      }
    }
    if (message === "") {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      return response.status(200).json({
        message: "All orders have been placed with success",
        totalSumSpent: totalSumSpent,
      });
    } else {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        }
        else{
        console.log("Email sent: " + info.response);
        }
      });
      return response
        .status(400)
        .json({ message: message, totalSumSpent: totalSumSpent });
    }
  } catch (error) {
    return response.status(500).json({
      message: "Internal sever error:" + error.message,
      totalSumSpent: totalSumSpent,
    });
  }
};

module.exports = {
  healthCheck,
  getAllSuppliesProduced,
  getTheNrSuppliedProducedBy,
  updateSupply,
  deleteSupply,
  addSupply,
  getSupplyById,
  getAllSupplies,
  generateNewIdSupply,
  placeOrders,
};
