let {sequelize,DataTypes,Model}=require("../init/DBconfig");

class User_permisson extends Model {}

User_permisson.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    permisson_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    createdBy:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    updatedBy:{
        type:DataTypes.INTEGER,
        allowNull:true
    }
},{
    modelName:"User_permisson",
    tableName:"user_permisson",
    sequelize
}
)

module.exports=User_permisson