//const dbConfig = require("../config/dbConfig");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
// const sequelize = new Sequelize('supplies', dbConfig.USER, dbConfig.PASSWORD, {
//   dialect: dbConfig.dialect,
//   host: dbConfig.host,
//   define: dbConfig.define,
//   operatorAliases: false,
//   database:dbConfig.DB,
//   pool:{
//     max:dbConfig.pool.max,
//     min:dbConfig.pool.min,
//     acquire:dbConfig.pool.acquire,
//     idle:dbConfig.pool.idle,
//   }
// });

const sequelize = new Sequelize('supplies', 'root', 'Capsunica2003', {
  //host:'mysql',
  host:'localhost',
  database:'supplies',
  dialect:'mysql',
  define:{
      timestamps:false,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 120000,
    idle: 10000
}
});


(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  }
})();

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require("./userModel")(sequelize, DataTypes);
db.tokens = require("./tokenModel")(sequelize, DataTypes);
db.roles = require("./roleModel")(sequelize, DataTypes);

db.roles.hasMany(db.users, {
  foreignKey: "idRole",
  onDelete: "CASCADE",
});




db.sequelize
  .sync({ force: false })
  .then(async () => {
    console.log("yes re-sync done!");
    await db.roles.initializeRoles();
    const [newUser, created] = await db.users.findOrCreate({
      where: { username: "admin" },
      defaults: {
        email: "myemail@gmail.com",
        password: bcrypt.hashSync("Admin12345", 10),
        idRole: 1,
      },
    });

    if (created) {
      console.log("Admin has been created: ", newUser);
    } else {
      console.log("Admin already exists: ", newUser);
    }

  
  })
  .catch((error) => {
    console.error("Error in re-sync:", error.message);
  });

module.exports = db;
