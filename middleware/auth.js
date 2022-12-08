let jwt=require ("jsonwebtoken")

let {sequelize,QueryTypes}=require("../init/DBconfig")
let user =require("../schema/userSchema")

function auth (permission){
    return async function(request,response,next){
        if(!request.headers || !request.headers.token){
            return response.status(500).send("token not found")
        }
        let verify = jwt.verify(request.headers.token,"shaikh@123")
        if(!verify || verify.error){
            return response.status(500).send("token invalid")
        }
    
        let users = await sequelize.query(`SELECT user.name,permisson.permission as permission
        FROM user LEFT JOIN user_permisson ON user.id=user_permisson.user_id 
        LEFT JOIN permisson ON user_permisson.permisson_id=permisson.id 
        WHERE user.id =${verify.id}`,{type:QueryTypes.SELECT})
        .catch((error)=>{
          return {error:error}
        })
        if(!users || (users && users.error)){
            return response.status(401).send("you dont hanve permisson for  this task")
        }
        let userPermission = {}
        for(let per of users){
          userPermission[per.permission]=1
        }

       
        if (permission && !userPermission[permission]){
          return response.send("access denied")
        }
        request.userData = {
            id:verify.id,name:users[0].name,permisson:userPermission
          }

        next()
    }
}

module.exports=auth