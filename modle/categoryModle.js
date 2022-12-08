let product1 = require("../schema/productSchema")
let category1 = require("../schema/categorySchema")
let joi = require ("joi")
const Category = require("../schema/categorySchema")
let auth = require("../middleware/auth")

async function addcategory(param){
    let schema =joi.object({
        name:joi.string().max(100).min(2).required(),
        discription:joi.string().required(),
        pid:joi.number().required()
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

async function categoryadd(param,userData){
    let check = await addcategory(param).catch((error)=>{
        return {error :error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let add = await Category.create({
        name:param.name,
        discription:param.discription,
        pid:param.pid,
        isDelete:false,
        isActive:true,
        createdBy:userData.id
    }).catch((error)=>{
        return {error:error}
    })
   console.log(add)
    if(!add || add.error){
        return {error:"internal server error"}
    }
    return {data :"category add successfull",add}
}

async function checkupdateCategory(param){
    let schema=joi.object({
        id:joi.number().max(100).min(1).required(),
        name:joi.string().max(100).min(1),
        discription:joi.string().max(500).min(1),
        
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

async function updateCategory(param,userData){
let check = await checkupdateCategory(param).catch((error)=>{
    return {error:error}
})
if(!check || check.error){
    return {error:check.error}
}

 let checkCategory = await Category.findOne({where:{id:param.id}}).catch((error)=>{
    return {error:error}
 })
 if(!checkCategory || checkCategory.error){
    return {error:"category not found"}
 }

let updatecategory= await Category.update({
    name:param.name,
    discription:param.discription,
    createdBy:userData.id
},{where:{id:checkCategory.id}}).catch((error)=>{
    return{error:error}
})

if(!updatecategory || updatecategory.error){
    return {error:updatecategory}
}
return {data:"category update succsesfull"}
}

async function checkviewCategory(param){
    let schema = joi.object({
       id:joi.number().max(100).min(1),
       name:joi.string().max(100).min(1)
    }).options({abortEarly:false})
    let check=schema.validate(param)
   if(check.error){
    let error =[]
    for(let err of check.error.details){
        error.push(err.message)
    }
    return {error:error}
   }
   return {data:check.value}
}

async function viewCategory(param){
    let check = await checkviewCategory(param).catch((error)=>{
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

    let findcategory=await Category.findAll(result).catch((error)=>{
        return{error:error}
    })
    if(!findcategory || findcategory.error){
        return {error:"internal server error1"}
    }
    return{data:findcategory}
}
async function checkdeleteCategory(param){
    let schema = joi.object({
        id:joi.number().max(100).min(1).required(),
        name:joi.string().max(100).min(2).required()
    }).options({abortEarly:false})
    let check=schema.validate(param)
    if(check.error){
        let error=[]
        for(let err of check.error.error){
            error.push(err.message)
        }
       return {error:error}  
    }
    return {data:check.value}
}

async function deleteCategory(param,userData){
    let check = await checkdeleteCategory(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find = await Category.findOne({where:{id:param.id,name:param.name}}).catch((error)=>{
        return {error:error}
    })
    if(!find || find.error){
        return {error:"category not found"}
    }
    let delet=await Category.update({isDelete:true,isActive:false,updatedBy:userData.id},
        {where:{id:find.id,name:find.name}}).catch((error)=>{
        return{error:error}
    })
    if(!delet || delet.error){
        return {error:"internal server error"}
    }
    return {data:"category delete succsesfull"}

}

async function checkundeletecategory(param){
    let schema = joi.object({
        id:joi.number().max(100).min(1).required(),
        name:joi.string().max(100).min(1).required()
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

async function undeletecategory(param,userData){
    let check = await checkundeletecategory(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find =await Category.findOne({where:{id:param.id,name:param.name}}).catch((error)=>{
        return {error:error}
    })
    if(!find || find.error){
        return {error:"category not found"}
    }
    let updateCategorye = await Category.update({isDelete:false,isActive:true,updatedBy:userData.id},
        {where:{id:find.id,name:find.name}}).catch((error)=>{
            return{error:error}
        })
        if(!updateCategorye || updateCategorye.error){
            return {error:"internal server error"}
        }
        return {data:"category undelete succsefull"}
}

module.exports = {
                  categoryadd,
                  updateCategory ,
                  viewCategory,
                  deleteCategory,
                  undeletecategory
}