let {sequelize,DataTypes,Model}=require("../init/DBconfig");

class Permisson extends Model{}

Permisson.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    permission:{
        type:DataTypes.STRING,
        allowNull:false
    }
},
{
    modelName:"Permisson",
    tableName:"permisson",
    sequelize
}
)

module.exports=Permisson