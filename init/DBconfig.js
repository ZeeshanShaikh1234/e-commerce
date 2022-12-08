let {Sequelize,Model,DataTypes,QueryTypes, Op} = require("Sequelize")

let sequelize = new Sequelize("mysql://root:@localhost/e_come_project")

sequelize.authenticate().then(()=>{
    console.log("connected to dataBase")
}).catch(()=>{
    console.log("not connected to dataBase")
})

module.exports={
    sequelize,
    Model,
    DataTypes,
    QueryTypes,
    Op
}