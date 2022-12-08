let {sequelize,DataTypes,Model,Op}=require("../init/DBconfig");

class User extends Model{}

 User.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
            allowNull:false
    },
    token:{
        type:DataTypes.STRING,
        allowNull:true
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },
    isDeleted:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    createdBy:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    upatedBy:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},
{
    modelName:"User",
    tableName:"user",
    sequelize
}
)

module.exports = {User,Op}