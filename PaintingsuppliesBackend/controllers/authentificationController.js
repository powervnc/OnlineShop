const db = require("../models");
const User = db.users;
const Token = db.tokens;
const bcrypt = require("bcryptjs");
const { raw } = require("body-parser");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');





//1.add User

const addUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    let existingUser = await User.findOne({ where: { username: username } });
    if (existingUser) {
      return res.status(409).json("User with this username already exists");
    }
    existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(409).json("User with this email already exists");
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      idRole: 3, //by default : User
    });
    req.user = { username: req.body.username, role: "user" };

    next();
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json("There is aleardy an user with this username");
  }
};

//2.sign up user
//! basically combined signup with login.
// can just add user in signupUpser and then client is redirected to login
//i my case i have just /login and a toggle between signup and login on the client side
const signupUser = async (req, res) => {
  try {
    const user = req.user;
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//3.find user
//find user by username and password
const findUser = async (req, res, next) => {
  try {
    const username = req.body.username;
    let foundUser;

    foundUser = await User.findOne({ where: { username: username } });
    console.log("found user :", foundUser);
    if (!foundUser) return res.status(404).json("User not found");

    const idRole = foundUser.idRole;
    console.log("idRole:", idRole);

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      foundUser.password
    );

    if (!passwordMatch) return res.status(401).json("Invalid password");
    else {
      let role = "user";
      if (idRole === 2) {
        role = "moderator";
      } else if (idRole === 1) {
        role = "admin";
      }
      req.user = { username: username, role: role };
      next();
    }
  } catch (error) {
    console.error("Error finding user:", error);
    return res.status(500).json("Internal server error");
  }
};

//4.login user
const loginUser = async (req, res) => {
  //authentification
  //creating token
  try {
    const user = req.user;
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//generate token
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7200s",
  });
}
const getUser = (token) => {
  try {
    const user = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    return user;
  } catch (error) {
    throw error; // Throw any errors encountered during verification
  }
};

const generateRefreshToken = async (user) => {
  try {
    const expiresInHours = 24 * 2;
    const expiresInMinutes = 0;
    const expiresInSeconds = 0;
    const expirationDate = new Date();
    //setTime uses miliseconds
    expirationDate.setTime(
      expirationDate.getTime() +
        expiresInHours * 60 * 60 * 1000 +
        expiresInMinutes * 60 * 1000 +
        expiresInSeconds * 1000
    );

    const token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: 3600,
    });
    await Token.create({ token: token, expiresAt: expirationDate });

    return token;
  } catch (error) {
    console.console("Error generating and storing refresh token:", error);
    throw error;
  }
};

//logout
const logout = async (req, res) => {
  try {
    await Token.destroy({
      where: {
        token: req.body.token,
      },
    });
  } catch (error) {
    console.error("Error deleting token in database:", error);
    return res.status(500).json("Internal server error");
  }
  return res.sendStatus(204);
};

//find token
const findToken = async (req, res) => {
  try {
    const token = req.body.token;
    const foundToken = await Token.findOne({ where: { token: token } });
    if (!foundToken)
      return res.status(200).json("No such  refresh token stored ");
    else res.status(400);
  } catch (error) {
    console.error("Error searching for token in database:", error);
    return res.status(500).json("Internal server error");
  }
};

//verify the expirations dates of the refresh tokens in the databse
const verifyExpiration = (token) => {
  return token.expiresAt.getTime() < new Date().getTime();
};

//generate new token based on refresh token
const getNewTokenBasedOnRefreshToken = async (req, res) => {
  const requestToken = req.body.token;
  if (requestToken == null)
    return res.status(401).json({ message: "Refresh Token is required!" });
  try {
    let refreshToken = await Token.findOne({ where: { token: requestToken } });
    if (!refreshToken) {
      return res
        .status(403)
        .json({ message: "Refresh token is not in database!" });
    }
    if (verifyExpiration(refreshToken)) {
      Token.destroy({ where: { token: refreshToken.token } });
      return res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
    }
    let user;
    user = await getUser(requestToken);
    const username = user.username;
    const role = user.role;
    const newAccessToken = generateAccessToken({
      username: username,
      role: role,
    });
    console.log("after generate new Acess Token");
    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const resetPassword = async (req, res, next) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'marinamariaemiliana@gmail.com', 
      pass: "uowi zaml lfqj aewp "
    }
  });
  try {
    const username = req.body.username;
    const email = req.body.email;
    let foundUser;

    foundUser = await User.findOne({ where: { username: username, email:email } });
    console.log("found user :", foundUser);
    if (!foundUser) return res.status(404).json("User not found");   
    const newPassword = generateNewPassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    foundUser.password = hashedPassword;
    await foundUser.save();
    const mailOptions = {
      from: 'marinamariaemiliana@gmail.com',
      to: email,
      subject: 'Password Reset Confirmation',
      text: `Your password has been reset successfully. Your new password is: ${newPassword}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send email' });
      }
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Password reset successful. Check your email for the new password.' });
    });
    
    
  
  } catch (error) {
    console.error("Error finding user:", error);
    return res.status(500).json("Internal server error");
  }
};


function generateNewPassword() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

module.exports = {
  addUser,
  findUser,
  loginUser,
  signupUser,
  getNewTokenBasedOnRefreshToken,
  logout,
  findToken,
  resetPassword
};
