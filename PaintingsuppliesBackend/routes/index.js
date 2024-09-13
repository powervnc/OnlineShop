const producerRouter=require('./producerRouter');
const supplyRouter=require("./supplyRouter");
const userRouter=require("./userRouter");
const authenticationRouter = require("./authenticationRouter");
module.exports = {
    producerRouter,
    supplyRouter,
    userRouter,
    authenticationRouter
};