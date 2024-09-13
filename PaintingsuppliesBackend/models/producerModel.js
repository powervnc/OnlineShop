module.exports = (sequelize, DataTypes)=>{
const producerModel = sequelize.define("producers", {
    idProducer: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nameProducer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return producerModel;
}