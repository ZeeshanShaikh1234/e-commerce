let cart=require("../modle/cartModle")
let auth=require("../middleware/auth")

async function addcart1(request,response){
    let check =await cart.addcart(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function viewcart1(request,response){
    let check=await cart.viewcart(request.userData).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function remove1(request,response){
    let check=await cart.removecart(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    console.log("check error",check)
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function cartupdate1(request,response){
    let check=await cart.cartupdate(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    console.log("check eror",check)
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

module.exports={
    addcart1,
    viewcart1,
    remove1,
    cartupdate1
}