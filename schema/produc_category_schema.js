let {sequelize,DataTypes,Model,Op}=require("../init/DBconfig");

class Product_category extends Model{}

Product_category.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    product_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    categrey_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    createdBy:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},
{
    modelName:"Product_category",
    tableName:"product_categrey",
    sequelize
}
)


module.exports={Product_category}