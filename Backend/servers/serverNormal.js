require("dotenv").config();
const { Sequelize, DataTypes, INTEGER } = require('sequelize');
const express = require("express");



const sequelize = new Sequelize('mysql', 'root', 'Capsunica2003', {
  host: 'mysql',
  dialect:'mysql',
  define:{
      timestamps:false,
  }
});


try {
  sequelize.authenticate();
  console.log('Connection has been established successfully for our second server.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}



const app = express();
//const routes=require('../routes')
// const cors=require("cors")
//const middlware=require('../middleware/authJwt')

// var corsOptions={
//   origin:'http://localhost:5173'
// }
// const io = require('socket.io')(8000, {
//   cors: {
//       origin: ['http://localhost:5173']
//   },
// })

// io.on('connection', (socket) => {
//   console.log('Client connected');

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });


//middleware
// app.use(cors(corsOptions))
app.use(express.json()); //in order to pass json with the body of req
app.use(express.urlencoded({extended:true}))

//routers
// app.use('/api/producers',routes.producerRouter)
// app.use('/api/supplies',routes.supplyRouter(io))


//can;t sepaarte normal server from the server for socket.io beacuse perhaps i will
//nedd ther server socket to generate signals when fetching to the normale serve




app.get("/test", (req, res) => {
  res.json("Hello, user");
});

// app.get('/health-check', (req, res) => {
//   res.sendStatus(200);
// });

app.listen(5001, () => {
  console.log("server is running on port 5001");
});
