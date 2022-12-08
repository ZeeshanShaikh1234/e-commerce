let multer = require ("multer")

let path = require("path")

function uploads(request,response,fileField,options){
    options={options} ?options:{}
    let destination=(options.destination) ? options.destination :"./uploads-images/";
    let fileSize = (options.fileSize) ? options.fileSize:1*1000*1000;
    let fileTypes = (options.fileTypes) ? options.fileTypes: /jpeg|jpg|png/;
    const stroage = multer.diskStorage({
        destination: function (req,file,cb){
            cb(null,destination)
        },
        filename:function(req,file,cb){
            console.log("file param",file);
            cb(null, file.fieldname + "-" + Date.now()+".jpg")
        }
    })
    let fileFilter = function(req , file, cb){
        let filetypes = fileTypes;
        let mimetype = filetypes.test(file.mimetype);
        let extname =filetypes.test(path.extname(file.originalname).toLowerCase());
        if(mimetype && extname){
            return cb(null , true)      
    }
    cb("error :file upload only support the " + " following filetype -" + filetypes)
    }

    let limit={fileSize:fileSize}
    let upload = multer({storage:stroage,limit:limit,fileFilter:fileFilter})
    console.log(typeof(fileField))
    if(typeof(fileField)=="string"){
        upload=upload.single(fileField)
        return new Promise ((resolve,reject)=>{
            upload(request,response,function(err){
                if(err){
                    reject(err)
                }
                resolve(request.file)
            })
        })
    }else if(typeof(fileField) == "object"){
        upload=upload.fields(fileField)
    }
    return new Promise ((resolve,reject)=>{
        upload(request,response,function(err){
            if(err){
                reject(err)
            }
            resolve(request.files)
        })
    })
    }

    module.exports= uploads

    