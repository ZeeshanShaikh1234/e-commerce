let {User,Op} = require ("../schema/userSchema")
let emails = require ("../heelper/mail")
let permisson=require("../schema/permisonSchema")
let user_permisson = require("../schema/user_permisson")
let joi = require("joi")
let bcrypt = require("bcrypt")
let jwt = require("jsonwebtoken");
let rs = require("randomstring")
let mailer = require("nodemailer");
const Permisson = require("../schema/permisonSchema")
const User_permisson = require("../schema/user_permisson")
const { sequelize, QueryTypes } = require("../init/DBconfig")
const { findOne } = require("../schema/permisonSchema")


async function checkRegister (param){
    let schema = joi .object({
        name:joi.string().max(30).min(2).required(),
        email:joi.string().max(80).min(2).required(),
        password:joi.string().max(12).min(1).required()
    }).options({abortEarly:false})
    let check = schema.validate(param)
    if(check.error){
        let error = []
        for(let err of check.error.details){
            error.push(err.message)
        }
        return{error:error}
    }
    return {data:check.value}
}

async function register(param){
    let check = await checkRegister(param,).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return{error:check.error}
    }
    
    // let checkUser = await User.findOne({where:{email:param.email,name:{ [Op.like]: `%${param.name}%`}}}).catch((error)=>{
    let checkUser = await User.findOne({where:{email:param.email}}).catch((error)=>{
        return{error:error}
    })
    if(checkUser){
        return{error:"this email is alredy register"}
    }
    param.password=await bcrypt.hash(param.password , 10).catch((error)=>{
        return {error:error}
    })
    let adduser = await User.create(param).catch((error)=>{
        return {error:error}
    })
    console.log("add error",adduser)
    if(!adduser || adduser.error){
        return{error:"internal server error"}
    }

    let givepermissson=await User_permisson.create({
        user_id:adduser.id,
        permisson_id:13
    }).catch((error)=>{
        return {error:error}
    })
   console.log(givepermissson)
    if(!givepermissson || givepermissson.error){
        return{error:"error permisson"}
    }
    return {data:"register succssesfull ",adduser,givepermissson}
}

async function checkLogin(param){
    let schema = joi.object({
        email:joi.string().max(80).min(2).required(),
        password:joi.string().max(12).min(2).required()
    }).options({abortEarly:false})
    let check = schema.validate(param)
    if(check.error){
        let error = []
     for (let err of check.error.details){
        error.push(err.message)
     }
     return{error:error}
    }
    return {data:check.value}
}

async function login(param){
    let check = await checkLogin(param).catch((error)=>{
        return{error:error}
    })
    if(!check || check.error){
        return{error:check.error}
    }
    let checkemail = await User.findOne({where:{email:param.email}}).catch((error)=>{
        return{error:error}
    })
    if(!check||check.error){
        return{error:"user not found"}
    }
    let checkpasswrod = await bcrypt.compare(param.password,checkemail.password).catch((error)=>{
        return{error:error}
    })
    if(!checkpasswrod || checkpasswrod.error){
        return {error:"pleas enter corect password"}
    }
    let key = "shaikh@123"
    let token = jwt.sign({id:checkemail.id},key)
    if(!token |token.error){
        return {error:"internal server error"}
    }
    return{data:"login succses",token}
}

async function checkforget(param){
    let schema = joi.object({
        email:joi.string().max(80).min(2).required()
    }).options({abortEarly:false})

    let check = schema.validate(param)
    if(check.error){
        let error = []
        for(let err of check.error.details){
            error.push(err.message)
        }
        return {error:error}
    }
    return {data:check.value}
}

async function forget(param){
    let check = await checkforget(param).catch((error)=>{
        return{error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }

    let findemail = await User.findOne({where:{email:param.email}}).catch((error)=>{
        return {error:error}
    })
 
    if(!findemail || findemail.error){
        return {error:"pleas enter corect email"}
    }
    let token = rs.generate(10);
    console.log("token",token);
    let updateEmail = await User.update({token:token},{where:{email:param.email}}).catch((error)=>{
        return {error:error}
    }) 
    
    if(!updateEmail || updateEmail.error){
        return {error:"internal server error"}
    }
    let mailoptins = {
        from:"poolking90zeeshan90@gmail.com",
        to:findemail.email,
        subject:"forget password token",
        text:"enter this token to reset your password:"+token
    }
     
    let send = await emails(mailoptins).catch((error)=>{
        return {error:error}
    })
    
    if (!send || send.error){
        return {error:"internal server error"}
    }
  return {data:"token send on your register email"}
}

async function checkreset (param){
    let schema=joi.object({
        email:joi.string().max(80).min(2).required(),
        token:joi.string().max(100).min(2).required(),
        newPassword:joi.string().max(12).min(2).required()
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

async function reset (param){
    let check = await checkreset(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error : check.error}
    }
    let findtoken = await User.findOne ({where:{token:param.token}}).catch((error)=>{
        return {error:error}
    })
    if(!findtoken || findtoken.error){
        return {error:"user token not fond"}
    }
    let updatePass = await User.update({password:await bcrypt.hash(param.newPassword,10)},{where:{id:findtoken.id}}).catch((error)=>{
        return {error:error}
    })
   if(!updatePass || (updatePass && updatePass.error)){
    return{error:updatePass.error}
   }

   let updatetoken = await User.update({token: ""},{where:{id:findtoken.id}}).catch((error)=>{
    return {error :error}
   })
  
   if(!updatetoken || updatetoken.error){
    return {error:"internal server error"}
   }

   return {data :"password reset succsecfull"}
}

async function checkchangepassword(param){
    let schema= joi.object({
        password:joi.string().max(12).min(2).required(),
        newPassword:joi.string().max(12).min(2).required()
    }).options({abortEarly:false})
    let check = schema.validate(param)
    if(check.error){
        let error=[]
        for (let err of check.error.details){
            error.push(err.message)
        }
        return{error:error}
    }
    return {data:check.value}
}

async function changepassword(param,userData){
    let userId= userData
    let check = await checkchangepassword(param).catch((error)=>{
        return {error:error}
    })
    if(!check ||check.error){
        return {error:check.error}
    }
    let find=await User.findOne({where:{id:userId.id}}).catch((error)=>{
        return {error:error}
    })
   
    if(!find || find.error){
        return {error:"user not found"}
    }
    let comparePass = await bcrypt.compare(param.password,find.password).catch((error)=>{
        return {error:error}
    })
    if(!comparePass ||comparePass.error){
        return {error:"pleas enter corect password"}
    }
    let updatePass = await  User.update({password :await bcrypt.hash(param.newPassword,10)},{where :{id:find.id}}).catch((error)=>{
        return {error:error}
    }) 
    if(!updatePass || updatePass.error){
        return {error:"internal server error"}
    }

    return{data:"password change succsefull"}
}

async function checkashingpermison(param){
    let schema = joi.object({
        id:joi.number().max(80).min(1).required(),
        permisson:joi.array().items(joi.number().required())
    }).options({abortEarly:false})
let check = schema.validate(param)
if(check.error){
    let error =[]
    for(let err of check.error.details){
        error.push(err.message)
    }
    return{error:error}
}
return {data:check.value}
}

async function assigpermison(param,userData){
    let userId = userData
    let check = await checkashingpermison(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find = await User.findOne({where:{id:userId.id}}).catch((error)=>{
        return {error:error}
    })
    if(!find || find.error){
        return {error :"token not found"}
    }
    let userfind= await User.findOne({where:{id:param.id}}).catch((error)=>{
        return {error:error}
    }) 
    if(!userfind || userfind.error){
        return {error:"user not found"}
    }
    let permisson = await Permisson.findAll({where:{id:{[Op.in]:param.permisson}}}).catch((error)=>{
        return {error:error}
    })
    
    if(!permisson || permisson.error){
        return {error:"permison not found"}
    }
    if(permisson.length != param.permisson.length){
        return {error:"pleas enter proper permisson"}
    }
    let userpermisson = []
    for (let i of param.permisson){
        userpermisson.push({user_id:param.id,permisson_id:i,createdBy:userId.id})
    }
    let result = await user_permisson.bulkCreate(userpermisson).catch((error)=>{
        return {error:error}
    })
    
    if(!result || (result && result.error)){
        return{error:"internal server error"}
    }
    return {data:"assing permisson succses"}
}

async function checkgetpermisson(param){
    let schema =joi.object({
        id:joi.number().max(100).min(1),
        permisson:joi.string().max(100).min(1)
    }).options({abortEarly:false})
    let check =schema.validate(param)
    if(check.error){
        let error=[]
        for(let err of check.error.details){
            error.push(err,message)
        }
        return {error:error}
    }
    return{data:check.value}
}

async function getpermisson(param,userData){
    let check=await checkgetpermisson(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let getp={}
    if(param.id){
        getp= {where:{id:param.id}}
    }
    if(param.permisson){
        getp= {where:{permisson:param.permisson}}
    }
    let findp=await Permisson.findAll(getp).catch((error)=>{
        return {error:error}
    })
    console.log(findp)
    if(!findp || findp.error){
        return {error:"internal server error"}
    }
    return {data:findp}
}

async function checkviewuserpermisson(param){
    let schema=joi.object({
      id:joi.number().max(100).min(1).required(),
    })
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

async function viewuserpermison(param,userData){
    let check=await checkviewuserpermisson(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let finduser=await User.findOne({id:param.id}).catch((error)=>{
        return{error:error}
    })
    if(!finduser || finduser.error){
        return {error:"user not found"}
    }
   let result =await sequelize.query("SELECT user.id,user.name,GROUP_CONCAT(permisson.permission) as permisson FROM user  LEFT JOIN user_permisson  ON user.id=user_permisson.user_id LEFT JOIN permisson  ON user_permisson.permisson_id=permisson.id WHERE user.id=:key",{replacements:{key:finduser.id},type:QueryTypes.SELECT}).catch((error)=>{
    return {error:error}
   })
 
   if(!result || result.error){
    return {error:result.error}
   }
   return{data:result}

}

async function checkeditprofile(param){
    let schema=joi.object({
        name:joi.string().max(25).min(1),
        email:joi.string().max(80).min(1)
    }).options({abortEarly:false})
    let check=schema.validate(param)
    if(check.error){
        let error=[]
        for(let err of check.error.details){
            error.push(err.message)
        }
        return {error:error}
    }
    return{data:check.value}
}

async function editprofile(param,userData){
    let check=await checkeditprofile(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find =await User.findOne({where:{id:userData.id}}).catch((error)=>{
        return {error:error}
    })
    if(!find || find.error){
        return {error:find.error}
    }
    let updatep=await User.update({name:param.name,email:param.email},{
        where:{id:find.id}
    }).catch((error)=>{
        return {error:error}
    })
    if(!updatep || updatep.error){
        return {error:error}
    }
    return {data:"profile update succsessfull"}
}

async function viewmyprofile(userData){
    let find=await User.findOne({attributes:["name","email","isActive","isDeleted"],where:{id:userData.id}}).catch((error)=>{
        return {error:error}
    })
    console.log(find)
    if(!find || find.error){
        return {error:"sumthind went wrong"}
    }
    return {data:"your profile",find}
}

async function checkdeleteuser(param){
    let schema=joi.object({
        id:joi.number().max(100).min(1).required()
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

async function deleteuser(param,userData){
    let check =await checkdeleteuser(param).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find=await User.findOne({where:{id:param.id}}).catch((error)=>{
        return {error:error}
    })
    if(!find || find.error){
        return {error:"user not found"}
    }
    let updateu=await User.update({isDeleted:true,upatedBy:userData.id},{
            where:{id:find.id}
    }).catch((error)=>{
        return {error:error}
    })
    if(!updateu || updateu.error){
        return {error:"internal server error"}
    }
    return {data:"user delete succses"}
}

async function checkundeleteuser(param){
    let schecma=joi.object({
        id:joi.number().max(100).min(1).required()
    }).options({abortEarly:false})
    let check=schecma.validate(param)
    if(check.error){
        let error=[]
        for(let err of check.error.details){
            error.push(err.message)
        }
        return {error:error}
    }
    return{data:check.value}
}

async function undeleteuser(param,userData){
    let check = await checkundeleteuser(param).catch((error)=> {
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find=await User.findOne({where:{id:param.id}}).catch((error)=>{
        return {error:error}
    })
    if(!find || find.error){
        return {error:"user not found"}
    }
    let updatec=await User.update({isDeleted:false,upatedBy:userData.id},
        {
            where:{
                id:find.id
            }
        }).catch((error)=>{
            return {error:error}
        })
        if(!updatec || updatec.error){
            return {error:"internal server error"}
        }
        return {data:"user undelete succses"}
}


async function checkdeactiveuser(param){
    let schecma=joi.object({
        id:joi.number().max(100).min(1).required()
    }).options({abortEarly:false})
    let check=schecma.validate(param)
    if(check.error){
        let error=[]
        for(let err of check.error.details){
            error.push(err.message)
        }
        return {error:error}
    }
    return{data:check.value}
}

async function deactive(param,userData){
    let check = await checkdeactiveuser(param).catch((error)=> {
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find=await User.findOne({where:{id:param.id}}).catch((error)=>{
        return {error:error}
    })
    if(!find || find.error){
        return {error:"user not found"}
    }
    let updatec=await User.update({isActive:false,upatedBy:userData.id},
        {
            where:{
                id:find.id
            }
        }).catch((error)=>{
            return {error:error}
        })
        if(!updatec || updatec.error){
            return {error:"internal server error"}
        }
        return {data:"user deactive succses"}
}

async function checkactiveuser(param){
    let schecma=joi.object({
        id:joi.number().max(100).min(1).required()
    }).options({abortEarly:false})
    let check=schecma.validate(param)
    if(check.error){
        let error=[]
        for(let err of check.error.details){
            error.push(err.message)
        }
        return {error:error}
    }
    return{data:check.value}
}

async function activeuser(param,userData){
    let check = await checkactiveuser(param).catch((error)=> {
        return {error:error}
    })
    if(!check || check.error){
        return {error:check.error}
    }
    let find=await User.findOne({where:{id:param.id}}).catch((error)=>{
        return {error:error}
    })
    if(!find || find.error){
        return {error:"user not found"}
    }
    let updatec=await User.update({isActive:true,upatedBy:userData.id},
        {
            where:{
                id:find.id
            }
        }).catch((error)=>{
            return {error:error}
        })
        if(!updatec || updatec.error){
            return {error:"internal server error"}
        }
        return {data:"user active succses"}
}
module.exports={
    register,
    login,
    forget,
    reset,
    changepassword,
    assigpermison,
    getpermisson,
    viewuserpermison,
    editprofile,
    viewmyprofile,
    deleteuser,
    undeleteuser,
    deactive,
    activeuser

}  