
let aut = require("../middleware/auth")
let modles = require ("../modle/categoryModle")
let file =require ("../heelper/multer")

async function addcategory1(request,response){
    let files=await file.uploads
    let category1 = await modles.categoryadd(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
  
    if(!category1 || category1.error){
        return response.send({error:category1.error})
    }
    return response.send({data:category1})
} 

async function updateCategory1(request,response){
    let category2 = await  modles.updateCategory(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    if(!category2 || category2.error)
    {
        return response.send({error:category2.error})
    }
    return response.send({data:category2})
}

async function viewCategory1(request,response){
    let category =await modles.viewCategory(request.body).catch((error)=>{
        return{error:error}
    })
    if(!category || category.error){
        return response.send({error:category.error})
    }
    return response.send({data:category})
}

async function deleteCategory1(request,response){
    let category3 =await modles.deleteCategory(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    if(!category3 || category3.error){
        return response.send({error:category3.error})
    }
    return response.send({data:category3})
}

async function undeletecategory1(request,response){
    let category4 = await modles.undeletecategory(request.body,request.userData).catch((error)=>{
        return {error:error}
    })
    console.log(category4)
    if(!category4 || category4.error){
        return response.send({error:category4.error})
    }
    return response.send({data:category4})
}
module.exports={
    addcategory1,
    updateCategory1,
    viewCategory1,
    deleteCategory1,
    undeletecategory1
}