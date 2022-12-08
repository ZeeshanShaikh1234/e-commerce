let {sequelize,DataTypes,Model,Op}=require("../init/DBconfig")

class Cart extends Model{}

Cart.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    product_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    modelName:"Cart",
    tableName:"cart",
    sequelize
}) 

module.exports={Cart,
                Op}