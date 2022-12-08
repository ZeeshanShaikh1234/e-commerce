
let user = require("../modle/userModle")



async function register1(request,response){
    let check = await user.register(request.body).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return response.send({error:check})
    }
    return response.send({data:check})
}

async function login1(request,response){
    let check =await user.login(request.body).catch((error)=>{
        return{error:error}
    })
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function forget1(request,response){
    let check = await user.forget(request.body).catch((error)=>{
        return {error:error}
    })
   
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function reset1(request,response){
    let check = await user.reset(request.body).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function changepassword1(request,response){
    let check = await user.changepassword(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function assingpermsson1(request,response){
    let check = await user.assigpermison(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    if (!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function getpermisson1(request,response){
    let check= await user.getpermisson(request.body,request.userData).catch((error)=>{
        return{error:error}
    })
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function viewuserpermisson1(request,response){
    let check =await user.viewuserpermison(request.body,request.userData).catch((error)=>{
        return{error:error}
    })
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function editprofile1(request,response){
    let check=await user.editprofile(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function viewmyprofile1(request,response){
    let check=await user.viewmyprofile(request.userData).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function deleteuser1(request,response){
    let check = await user.deleteuser(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function undeleteuser1(request,response){
    let check =await user.undeleteuser(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    if(!check || check.errro){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function deactive1(request,response){
    let check =await user.deactive(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    if(!check || check.errro){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function useractive1(request,response){
    let check =await user.activeuser(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    if(!check || check.errro){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}
module.exports = {
                register1,
                login1,
                forget1,
                reset1,
                changepassword1,
                assingpermsson1,
                getpermisson1,
                viewuserpermisson1,
                editprofile1,
                viewmyprofile1,
                deleteuser1,
                undeleteuser1,
                deactive1,
                useractive1
}