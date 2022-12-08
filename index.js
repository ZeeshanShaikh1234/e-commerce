let express = require("express")
const app = express()
let rout = require ("./rout")
let logger = require("./init/winston")

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(rout)
logger.error("error")


app.listen(3001,(()=>{
    console.log("connected")
}))

