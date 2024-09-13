
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
      points:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:100
      }
    });
    return userModel;
  };
  