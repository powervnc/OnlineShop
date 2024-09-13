require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const server = require("https").createServer(
  {
    key: require("fs").readFileSync("key.pem"),
    cert: require("fs").readFileSync("cert.pem"),
  },
  app
);

const routes = require("./routes");
//middleware
app.use(express.json()); //in order to pass json with the body of req
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"] }));

//routes
app.get("/test", (req, res) => {
  res.json("Hello, user");
});

app.use("/api1", routes.authentificationRouter);

server.listen(5001, () => {
  console.log("server is running on port 5001");
});
