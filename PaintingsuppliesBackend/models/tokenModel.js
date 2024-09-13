
module.exports = (sequelize, DataTypes) => {
    const  refreshTokenModel = sequelize.define("refresToken", {
      idToken:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull:false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },

    });
    return refreshTokenModel;
  };
  