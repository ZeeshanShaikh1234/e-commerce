let express = require ("express")
let app = express()
let cors = require("cors")

app.use(cors(
    {
        origin:(origin,cb)=>{
            let whitelisting = ["abc.com"];
            if (whitelisting.indexOf(origin) == -1){
                return cb(new Error("acces denide"),false)
            }
            return cb(null , true)
        }
    }
))

module.exports = app