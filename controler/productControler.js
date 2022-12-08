let aut = require("../middleware/auth")
let modles = require ("../modle/categoryModle")
let file =require ("../heelper/multer")
let help=require("../heelper/multer")
let product1=require("../modle/productModle")
const { func } = require("joi")
const uploads = require("../heelper/multer")
const { path } = require("../rout")

async function addproduct1(request,response){
    let addpic=await uploads(request,response,[{name:"product",maxCount:2}],{destination:"./product/",fileSize:3*1000*1000}).catch((error)=>{
        return {error:error}
    })
    console.log("add picc error",addpic)
if(!addpic || addpic.error){
    return response.send({error:addpic.error})
}
let data= []
for(let i of addpic.product){
    data.push(i.path)
}

let path=data.join(" AND ")

    let check=await product1.addproduct(request.body,request.userData,request.files.product).catch((error)=>{
        return{error:error}
    })
  console.log(request.body,request.files.product,request.userData)
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function updateproduct1(request,response){
    let check = await product1.updateproduct(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return response.send ({error:check.error})
    }
    return response.send({data:check})
}

async function deleteproduct1(request,response){
    let check = await product1.deleteproduct(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    console.log("check error",check)
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send ({data:check})
}

async function viewproducte1(request,response){
    let check = await product1.viewproducte(request.body).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function undelete1(request,response){
    let check = await product1.undelete(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function deactiveproduct1(request,response){
    let check =await product1.deactiveproduct(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}

async function activeproduct1(request,response){
    let check = await product1.activeproduct(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    if(!check || check.error){
        return response.send({error:check.error})
    }
    return response.send({data:check})
}
module.exports={addproduct1,
                updateproduct1,
                deleteproduct1,
                viewproducte1,
                undelete1,
                deactiveproduct1,
                activeproduct1
}