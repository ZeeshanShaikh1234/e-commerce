let {Product} = require("../schema/productSchema")
let {Op,Category} = require("../schema/categorySchema")
let auth = require("../middleware/auth")
let help=require("../heelper/multer")
let joi = require ("joi")
const { func } = require("joi")
const {Product_category} = require("../schema/produc_category_schema")
const { max } = require("../schema/permisonSchema")


async function checkaddproduct(param){
    let schema =joi.object({
        
        name:joi.string().max(100).min(2).required(),
        pId:joi.number().max(100).min(1).required(),
        discription:joi.string().max(1000).min(1).required(),
        quantity:joi.number().max(100).min(1).required(),
        price:joi.number().required(),
        discount:joi.number().max(100).min(1),
        discounted_price:joi.number().max(100).min(1),
        stokAlert:joi.number().max(1000).min(1).required(),
        category:joi.array().items(joi.number().max(100).min(1)).required()
        }).options({abortEarly:false})

        let check =schema.validate(param)
        if(check.error){
            let error=[]
            for(let err of check.error.details){
                error.push(err.message)
            }
            return {error:error}
        }
        return {data:check.value}
    }

    async function addproduct(param,userData,uploads){
        console.log(userData)
        let check = await checkaddproduct(param).catch((error)=>{
            return {error:error}
        })
        if(!check || check.error){
            return {error:check.error}
        }
        let checkcategory=await Category.findAll({where:{id:{[Op.in]:param.category}}}).catch((error)=>{
            return {error:error}
        })
        console.log(checkcategory)
        if(!checkcategory || checkcategory.error){
            return {error:"catergory not found"}
        }

        if(checkcategory.length != param.category.length){
            return {error:"pleas enter proper category"}
        }
        let imagePath="";
        console.log("res",uploads)
        for(let i of uploads){
            imagePath = imagePath + i.path+","
        }
        let add=await Product.create({
            name:param.name,
            pId:param.pId,
            images:imagePath,
            discription:param.discription,
            quantity:param.quantity,
            discount:param.discount,
            discounted_price:param.discounted_price,
            price:param.price,
            stokAlert:param.stokAlert,
            createdBy:userData.id,
            isActive:true,
            isDelete:false
        }).catch((error)=>{
            return{error:error}
        })
        console.log(add)
        if(!add || add.error){
            return {error:add.error}
        }

        let addtable=[]
        for(let cat of param.category){
            addtable.push({category_id:cat,product_id:add.id,createdBy:userData.id})
        }
        let addcategorytable=await Product_category.bulkCreate(addtable).catch((error)=>{
            return {error:error}
        })
        if(!addcategorytable || addcategorytable.error){
            return {error:"internal server error"}
        }
        return {data:"product add succsessfull"}
    }

    async function checkupdateproduct(param){
        let schema = joi.object({
            id:joi.number().max(100).min(1).required(),
            name:joi.string().max(100).min(1),
            discription:joi.string().max(100).min(1),
            quantity:joi.number().max(100).min(1),
            price:joi.number(),
            stokAlert:joi.number().max(100).min(1)
        }).options({abortEarly:false})
        let check = schema.validate(param)
        if(check.error){
        let error=[]
        for(let err of check.error.details){
            error.push(err.message)
        }
        return {error:error}
    }
    return {data:check.value}
}

async function updateproduct(param,userData){
    let check = await checkupdateproduct(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find=await Product.findOne({where:{id:param.id}}).catch((error)=>{
        return {error:error}
    })
    if(!find || find.error){
        return {error :"product noot found pleas enter proper product id"}
    }
    let updatep=await Product.update({
        name:param.name,
        discription:param.discription,
        quantity:param.quantity,
        price:param.price,
        stokAlert:param.stokAlert,
        updatedBy:userData.id
    },{where:{id:find.id}}
    ).catch((error)=>{
        return{error:error}
    })
    if(!updatep || updatep.error){
        return {error:"internal server error"}
    }
    return {data:"product update succsesfull"}
}

async function checkdeleteproducte(param){
    let schema=joi.object({
        id:joi.number().max(100).min(1).required(),
        name:joi.string().max(100).min(1).required()
    }).options({abortEarly:false})
    let check =schema.validate(param)
    if(check.error){
       let error =[]
       for(let err of check.error.details){
            error.push(err.message)
       }
       return {error:error}
    }
    return {data:check.value}
}

async function deleteproduct(param,userData){
    let check = await checkdeleteproducte(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find =await Product.findOne({where:{id:param.id,name:param.name}}).catch((error)=>{
        return{error:error}
    })
    if(!find || find.error){
        return {error:find.error}
    }
    let updateDP=await Product.update({isActive:false,isDelete:true,updatedBy:userData.id},
        {where:{id:find.id,name:find.name}}).catch((error)=>{
            return {error:error}
        })
        if(!updateDP || updateDP.error){
            return {error:"internal server error"}
        }
        return {data :"product delete succsesfull"}
}
async function checkviewproducte(param){
    let schema = joi.object ({
        id:joi.number().max(100).min(1),
        name:joi.string().max(100).min(1)
    })
    let check =schema.validate(param)
      if(check.error){
        let error=[]
        for(let err  of check.error.details){
            error.push(err.message)
        }
        return {error:error}
      }
    return {data:check.value}
}

async function viewproducte(param){
    let check = await checkviewproducte(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let result ={}
    if(param.id){
        result={where:{id:param.id}}
    }
    if(param.name){
    result={where:{name:param.name}}}
    
    let find =await Product.findAll(result).catch((error)=>{
        return {error:error}
    })
    if(!find || find.error){
        return {error:"internal server error"}
    }
    return{data:find}
}

async function checkundelete(param){
    let schema =joi.object({
        id:joi.number().max(100).min(1).required()
    })
    let check =schema.validateAsync(param)
    if(check.error){
        let error=[]
        for(let err of check.error.details){
            error.push(err.message)
        }
        return {error:error}
    }
    return {data:check.value}
}

async function undelete(param,userData){
    let check = await checkundelete(param).catch((error)=>{
        return{error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find = await Product.findOne({where:{id:param.id}}).catch((error)=>{
        return {error:error}
    })
    if(!find || find.error){
        return {error:check.error}
    }
    let updatedelete=await Product.update({isActive:true,isDelete:false,updatedBy:userData.id},
        {where:{id:find.id}}).catch((error)=>{
            return {error:error}
        })
        if(!updatedelete || updatedelete.error){
            return {error:"internal server error"} 
        }
        return{data :"producte undelete sucssesfull"}
}

async function checkdeactiveproduct(param){
    let schema=joi.object({
        id:joi.number().max(100).min(1).required()
    }).options({abortEarly:false})
    let check=schema.validate(param)
    if(check.error){
        let error=[]
        for(let err of check.error.details){
            error.push(err.message)
        }
        return{error:error}
    }
    return {data:check.value}
}

async function deactiveproduct(param,userData){
    let check =await checkdeactiveproduct(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find=await Product.findOne({where:{id:param.id}}).catch((error)=>{
        return {error:error}
    })
    if(!find || find.error){
        return {error:find.error}
    }
    let updateA=await Product.update({isActive:false,updatedBy:userData.id},{
        where:{id:find.id}
    }).catch((error)=>{
        return {error:error}
    })
  if(!updateA || updateA.error){
    return {error:"internal server error"}
  }
  return {data:"product deactive scuccsesfull"}
}

async function checkactiveproducte(param){
    let schema =joi.object({
        id:joi.number().max(100).min(1).required()
    }).options({abortEarly:false})
    let check =schema.validate(param)
    if(check.error){
        let error=[]
        for(let err of check.error.details){
            error.push(err.message)
        }
        return {error:error}
    }
    return {data:check.value}
}

async function activeproduct(param,userData){
    let check=await checkactiveproducte(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find =await Product.findOne({where:{id:param.id}}).catch((error)=>{
        return {error:error}
    })
    if(!find || find.error){
        return {error:find.error}
    }
    let updateAp=await Product.update({isActive:true,updatedBy:userData.id},
        {where:{id:find.id}}).catch((error)=>{
            return {error:error}
        })
        
        if(!updateAp || updateAp.error){
            return {error:"internal server error"}
        }
        return {data:"product active scuccsefull"}
}
module.exports={
    addproduct,
    updateproduct,
    deleteproduct,
    viewproducte,
    undelete,
    deactiveproduct,
    activeproduct
}      