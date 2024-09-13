const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.users;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  //authHeader = BEARER token
  console.log("Authorization Header:", authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Token:", token);
  if (token == null)
    return res.status(401).json({ message: "No access token provided" });
  console.log("ACCESS Token:", process.env.ACCESS_TOKEN_SECRET);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      //console.log("error token:",err);
      return res
        .status(403)
        .json({ message: "The access token is not valid!" }); //token no longer valid
    }
    req.user = user;
    console.log(req.user);

    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { username: req.user.username } });

    let isAdmin = false;

    if (user.idRole == 1) isAdmin = true;

    if (isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Require Admin Role!" });
    }
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const isModerator = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { username: req.user.username } });

    let isModerator = false;
    if (user.idRole === 2) isModerator = true;
    if (isModerator) {
      next();
    } else {
      res.status(403).json({ message: "Require  Moderator Credentialse!" });
    }
  } catch (error) {
    console.error("Error in isModerator middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const isModeratorOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { username: req.user.username } });
    console.log(user);
    let isModeratorOrAdmin = false;
    if (user.idRole === 1 || user.idRole === 2) isModeratorOrAdmin = true;
    if (isModeratorOrAdmin) {
      next();
    } else {
      res
        .status(403)
        .json({ message: "Require at least Moderator Credentialse!" });
    }
  } catch (error) {
    console.error("Error in isModeratorOrAdmin middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin,
};

module.exports = authJwt;
