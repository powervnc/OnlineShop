
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const session=require("express-session")

//middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser("helloword"));

//session recap (created on server side)
//by default, server doesn't know which client requests resources
//this is why session are created which will be stored on teh server side (in the session stoarge object ---> see req.sessionStorage)
//we are sending cookies with the session id value which is added to the header of every req of the client--> this way the server identifies the client 

app.use(session(
    {
        secret:'emiliana the mastermind',//used to sign the cookie. not too simple in order not to easily decode
        saveUninitialized:false,//don't want to save unmodified session data. saving, only when modified
        resave:false,
        cookie:{
            maxAge:60000*60
        }
    }
))

//port
const PORT = process.env.PORT || 8085;


app.get("/", (req, res) => {
    console.log(req.session)
    console.log(req.sessionID)
    console.log(req.sessionStore)
    req.session.visited=true
  //res.cookie("hello", "word", { maxAge: 60000*60, signed: true }); if we want to sens a coookie manually, whatever we eant
  res.json({ message: "hello from api" });
});


//ignore this. this is just working withc cookies without having any session
// //testing the cookies parser
// app.get("/api/products", (req, res) => {
//   console.log(req.headers.cookie); //string format
//   console.log(req.cookies); //beautiful dictionarry form with cookie-parser
//   //becomes empty cause cookies are now signed
//   console.log(req.signedCookies.hello) 
//   if(req.signedCookies.hello && req.signedCookies.hello==="word")
//   res.status(200).send([{ id: 124, name: "produce1" }]);
// else res.status(403).send("wrong or expired cookie")

// });


//reminder: the data from sessionStoarge is lost when the server closes --> we need a database

app.post("/auth",(req,res)=>{
    const{
        body:{username,password}
    }=req
    const findUser=mockUsers.find(
        user=>user.username===username
    )
    if(!findUser)
        res.status(401).send({msg:`no user with the username ${username}`})
    if(findUser.password!==password)
        res.status(401).send({msg:'wrong password'})
    req.session.user=findUser
    return res.status(200).send(findUser)

})



//server
app.listen(PORT, () => {
  console.log("server is running on port ", PORT);
});
