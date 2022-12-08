const { request } = require("../rout");

let errorhandel = (error,request,response,next)=>{
    let status = 505
    let data={
        message:"internal serever error",
        orignalError:error.message
    }
    return response.status(status).send({status:"fail",error:data})
}

module.exports=errorhandel