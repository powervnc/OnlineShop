const db = require("../models");
const User = db.users;

const getAllUsersNotAdmins = async (req, res) => {
  const query = `
              SELECT u.username, r.nameRole FROM users u
              INNER JOIN roles r ON r.idRole = u.idRole
              WHERE r.idRole !=1 
          `;
  let [usersDatabase, metadata] = await db.sequelize.query(query);
  res.json(usersDatabase);
};


const BecomeModerator = async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ where: { username: username } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({ idRole: 2 });

    const query = `
    SELECT u.username, r.nameRole FROM users u
    INNER JOIN roles r ON r.idRole = u.idRole
    WHERE r.idRole !=1 
`;
    let [usersDatabase, metadata] = await db.sequelize.query(query);
    res.json(usersDatabase);
  } catch (error) {
    console.error("Error while updating user role:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const BecomeUser = async (req, res) => {
  console.log("Become user");
  const { username } = req.body;

  try {
    const user = await User.findOne({ where: { username: username } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.update({ idRole: 3 });
    const query = `
    SELECT u.username, r.nameRole FROM users u
    INNER JOIN roles r ON r.idRole = u.idRole
    WHERE r.idRole !=1 
`;
    let [usersDatabase, metadata] = await db.sequelize.query(query);
    res.json(usersDatabase);
  } catch (error) {
    console.error("Error while updating user role:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { username } = req.body;
    let n = await User.destroy({ where: { username: username } });
    console.log(`number of deleted rows: ${n}`); //must be 1
    const query = `
    SELECT u.username, r.nameRole FROM users u
    INNER JOIN roles r ON r.idRole = u.idRole
    WHERE r.idRole !=1 
`;
    let [usersDatabase, metadata] = await db.sequelize.query(query);
    res.json(usersDatabase);
  } catch (error) {
    console.error("Error while deleting:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addPointsToUser=async (req, res) => {
  const user= req.user;
  const username= user.username;
  try {
    const { pointsToAdd} = req.body;
    const user = await User.findOne({ where: { username: username } });
    const newValuePoints=user.points+pointsToAdd;
    await user.update({ points:newValuePoints});
    res.json({points:newValuePoints});
  } catch (error) {
    console.error("Error while adding points:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const getPoints= async (req, res) => {
  const user= req.user;
  const username= user.username;
 try{
   const user = await User.findOne({where:{username:username}});
   const points = user.points;
   res.json({points:points});
 }catch(error){
  console.error("Error while  getting points:", error);
  res.status(500).json({ message: "Internal Server Error" });

 }



}



module.exports = {
  BecomeModerator,
  getAllUsersNotAdmins,
  BecomeUser,
  deleteUser,
  addPointsToUser,
  getPoints
};
