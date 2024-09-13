//establishing connection
require("dotenv").config();
const { setInterval } = require("timers");
const db = require("./models");
const Supply = db.supplies;
const Producer = db.producers;

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;
//later turn it back in https
// const server = require('https').createServer({
//   key: require('fs').readFileSync('key.pem'),
//   cert: require('fs').readFileSync('cert.pem'),
// }, app)

const server = require("http").createServer(app);
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"] }));
const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:80",
      "http://localhost:5173",
    ],
  },
});
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 


const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1000,
  message: "Too many requests from this IP, please try again later",
});
app.use(limiter);
const { faker, allFakers } = require("@faker-js/faker");

const generateRandomSupplies = async () => {
  try {
    const producers = await Producer.findAll();
    const randomProducers = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * producers.length);
      randomProducers.push(producers[randomIndex]);
    }

    const allSupplies = [];
    for (const producer of randomProducers) {
      for (let i = 0; i < 3; i++) {
        const supply = {
          nameSupply: faker.commerce.productName(),
          descriptionSupply: faker.commerce.department(),
          priceSupply: 2,
          idProducer: producer.idProducer,
          nrOfSupplies: 1,
          specialOffer: 1,
        };
        const createdSupply = await Supply.create(supply);
        allSupplies.push({
          ...supply,
          idSupply: createdSupply.idSupply,
        });
      }
    }
    io.emit("newItems", allSupplies); //send message to all connected clients;
    console.log("ALLL:", allSupplies);
    console.log("Generated and emitted supplies:", allSupplies);
  } catch (error) {
    console.error("Error generating supplies:", error);
    io.emit("supplyError", "Error generating supplies");
  }
};

const intervalDuration = 300000; 
// const intervalId = setInterval(() => {
//   generateRandomSupplies();
// }, intervalDuration);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const cleanup = () => {
  //clearInterval(intervalId);
  console.log("Interval cleared. Cleaning up...");
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);


const routes = require("./routes");

app.use("/api2/supply", routes.supplyRouter);
app.use("/api2/producer", routes.producerRouter);
app.use("/api2/user", routes.userRouter);
app.use("/api1", routes.authenticationRouter);

server.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});

module.exports = app;
