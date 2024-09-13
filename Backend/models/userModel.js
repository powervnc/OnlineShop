
module.exports = (sequelize, DataTypes) => {
    const  userModel = sequelize.define("user", {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
     
      
    });
    return userModel;
  };
  