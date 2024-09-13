module.exports = (sequelize, DataTypes) => {
    const  orderModel = sequelize.define("order", {
      idOrder:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      //foreign key user
      //foreign key product
      //quantity product    
      //date order ???

    dateOrder:{
        type:DataTypes.DATE,
        allowNull:true,
    
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false,

    }

    });
    return orderModel;
}