let user=require("./controler/userControler")
let category=require("./controler/categoryControler")
let authentication=require("./middleware/auth")
let errorhande = require("./middleware/errorHandler")
let product=require("./controler/productControler")
let cart=require("./controler/cartControler ")
let express = require ("express");
let cors = require("./init/cors")
let app = express()
app.use(cors);  

// users url

app.post("/api/v2/user/register",user.register1);
app.post("/api/v2/user/login",user.login1);
app.post("/api/v2/user/forget",user.forget1);
app.post("/api/v2/user/reset",user.reset1);
app.post("/api/v2/user/getpermisson",authentication("assing_permisson"),user.getpermisson1);
app.post("/api/v2/user/changepassword",authentication(),user.changepassword1);
app.post("/api/v2/user/assingpermison",authentication("assing_permisson"),user.assingpermsson1);
app.get("/api/v2/user/viewpermisson",authentication("assing_permisson"),user.viewuserpermisson1);
app.post("/api/v2/user/editprofile",authentication("user "),user.editprofile1);
app.post("/api/v2/user/viewmyprofile",authentication("user "),user.viewmyprofile1)
app.delete("/api/v2/user/deleteuser",authentication("delete_user"),user.deleteuser1)
app.delete("/api/v2/user/undeleteuser",authentication("delete_user"),user.undeleteuser1)
app.delete("/api/v2/user/deactiveuser",authentication("delete_user"),user.deactive1)
app.delete("/api/v2/user/activeuser",authentication("delete_user"),user.useractive1)



// product urls
app.post("/api/v2/user/addproduct",authentication("add_product"),product.addproduct1);
app.post("/api/v2/user/updateproduct",authentication("update_product"),product.updateproduct1);
app.delete("/api/v2/user/deleteproducte",authentication("add_product"),product.deleteproduct1);
app.get("/api/v2/user/viweproducte",product.viewproducte1);
app.delete("/api/v2/user/undeleteproducte",authentication("delete_product"),product.undelete1);
app.delete("/api/v2/user/deactiveproduct",authentication("delete_product"),product.deactiveproduct1);
app.delete("/api/v2/user/activeprodut",authentication("delete_product"),product.activeproduct1);


// catagory urls
app.post("/api/v2/user/category",authentication("add_categery"),category.addcategory1);
app.post("/api/v2/user/updateCategory",authentication("update_Category1"),category.updateCategory1);
app.get("/api/v2/user/viweCategory",category.viewCategory1);
app.delete("/api/v2/user/deletecategory",authentication("delete_category"),category.deleteCategory1);
app.delete("/api/v2/user/undeletecategory",authentication("delete_category"),category.undeletecategory1);


// add to cart urls
app.post("/api/v2/user/addtocart",authentication("user "),cart.addcart1);
app.post("/api/v2/user/viewcart",authentication("user "),cart.viewcart1);
app.post("/api/v2/user/removecart",authentication("user "),cart.remove1);
app.post("/api/v2/user/updatecart",authentication("user "),cart.cartupdate1);

app.use(errorhande)
module.exports=app