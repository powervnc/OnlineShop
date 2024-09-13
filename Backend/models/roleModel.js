
//insert 3 roles
// admin -1
// moderator -2
//user -3

module.exports = (sequelize, DataTypes) => {
    const  roleModel = sequelize.define("role", {
      idRole:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nameRole: {
        type: DataTypes.STRING
      }      
    });

    roleModel.initializeRoles = async () => {
      const roles = ["Admin", "Moderator", "User"]; 
      for (const role of roles) {
        const roleExists = await roleModel.findOne({ where: { nameRole: role } });
        if (!roleExists) {
          await roleModel.create({ nameRole: role });
        }
      }
    };

    return roleModel;
  };
  