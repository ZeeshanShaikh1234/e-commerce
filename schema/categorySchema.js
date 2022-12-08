let {sequelize,DataTypes,Model,Op}=require("../init/DBconfig");

class Category extends Model{}
Category.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    discription:{
        type:DataTypes.STRING,
        allowNull:false
    },
    pid:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    createdBy:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    
        updatedBy:{
            type:DataTypes.STRING,
            allowNull:true
        },
    
    isDelete:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    }
},
{
    modelName:"Category",
    tableName:"categery",
    sequelize
}
)

module.exports={Category,Op}