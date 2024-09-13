module.exports = (sequelize, DataTypes) => {
  const supplyModel = sequelize.define(
    "supplies",
    {
      idSupply: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nameSupply: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descriptionSupply: {
        type: DataTypes.STRING,
      },
      priceSupply: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nrOfSupplies:{
        type:DataTypes.INTEGER,
        allowNull:false,
      },
      categorySupply:{
        type:DataTypes.STRING,
        allowNull:true,
        defaultValue:"Painting Supplies"

      },
      specialOffer:{
        type:DataTypes.BOOLEAN,
        allowNull:true,
        defaultValue:false
      },
      supplyImage: {
        type: DataTypes.STRING,
        allowNull:true
      },
    },
    {
      tableName: "supplies",
    }
  );
  return supplyModel;
};
