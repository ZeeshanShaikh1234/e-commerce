let {Op,Cart}=require("../schema/cartSchema")
let product=require("../schema/productSchema")
let joi=require("joi")
let auth=require("../middleware/auth")
const { findOne } = require("../schema/cartSchema")
const { sequelize, QueryTypes } = require("../init/DBconfig")
const { required } = require("joi")

async function checkaddcart(param){
    let schema=joi.object({
        product_id:joi.number().max(100).min(1).required(),
        quantity:joi.number().max(100).min(1).required()
    }).options({abortEarly:false})
    let check=schema.validate(param)
    if(check.error){
        let error=[]
        for(let err of check.error.details){
            error.push(err.message)
        }
        return {error:error}
    }
    return {data:check.value}
}

async function addcart(param,userData){
    let check=await checkaddcart(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find=await Cart.findOne({where:{user_id:userData.id,product_id:param.product_id}}).catch((error)=>{
        return {error:error}
    })
    if(find ){
        return {error:"this peoduct is already in your cart"}
    }
    let add =await Cart.create({user_id:userData.id,product_id:param.product_id,quantity:param.quantity}).catch((error)=>{
        return {error:error}
    })
    if(!add || add.error){
        return {error:"internal server error"}
    }
    return {data:"add to cart successfull"}
}

async function viewcart(userData){
    let find=await Cart.findAll({where:{user_id:userData.id},raw:true}).catch((error)=>{
        return {error:error}
    })
    console.log("user find",find)
    if(!find || find.error){
        return {error:"internal server error1"}
    }
    let getproduct=await sequelize.query("SELECT product.name,product.price,product.discount,product.discounted_price,product.images,cart.quantity  FROM cart LEFT JOIN product ON product.id=cart.product_id LEFT JOIN user ON user.id=cart.user_id Where user.id=:key",{
        replacements:{key:userData.id},
        type:QueryTypes.SELECT
    }).catch((error)=>{
        return {error:error}
    })

    let final_price=0
    for(let a in getproduct){
        getproduct[a].total_price=getproduct[a].discounted_price*getproduct[a].quantity;
        final_price=(getproduct[a].total_price + final_price)
    }

    getproduct.push({final_price:final_price})

    if(!getproduct || getproduct.error){
        return {error:"internal server error"}
    }
    if(getproduct.length == 0){
        return{dat:"cart emtye"}
    }
    return{data:getproduct}
}

async function checkremovecart(param){
    let schema=joi.object({
        product_id:joi.number().max(100).min(1).required()
    }).options({abortEarly:false})
    let check = schema.validate(param)
    if(check.error){
        let error=[]
        for(let err of check.error.details){
            error.push(err.message)
        }
        return{error:error}
    }
    return {data:check.value}
}

async function removecart(param,userData){
    let check=await checkremovecart(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find=await Cart.findOne({where:{
        [Op.and]:[{
            product_id:param.product_id,
            user_id:userData.id
        }]
    }}).catch((error)=>{
        return {error:error}
    })
    if(!find || find.error){
        return {error:"your cart is alrady emty"}
    }
   let remove=await Cart.destroy({
            where:{
                id:find.id
            }
   }).catch((error)=>{
    return {error:error}
   })
   if(!remove || remove.error){
    return {error:"internal server error"}
   }
   return {data:"product succssesfully remove in your cart"}
}

async function checkcartupdate(param){
    let schema=joi.object({
        product_id:joi.number().max(100).min(1).required(),
        quantity:joi.number().max(100).min(1).required()
    }).options({abortEarly:false})
    let check = schema.validate(param)
    if(check.error){
        let error=[]
        for(let err of check.error.details){
            error.push(err.message)
        }
        return{error:error}
    }
    return{data:check.value}
}

async function cartupdate(param,userData){
    let check=await checkcartupdate(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find=await Cart.findOne({where:{product_id:param.product_id,user_id:userData.id}}).catch((error)=>{
        return{error:error}
    })
    if(!find || find.error){
        return {error:"internal server error"}
    }
    let updatec=await Cart.update({quantity:param.quantity},{where:{id:find.id}}).catch((error)=>{
        return {error:error}
    })
    if(!updatec || updatec.error){
        return {error:"somthind went wrong try after some time"}
    }
    return {data:"cart update successfull"}
}

module.exports={
    addcart,
    viewcart,
    removecart,
    cartupdate
}