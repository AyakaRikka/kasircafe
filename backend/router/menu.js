const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config") //import konfigurasi database
const md5 = require("md5") //mengubah password menjadi format md5
const Cryptr = require("cryptr")
const crypt = new Cryptr("140533602676") //secret key, boleh diganti :)


const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname))

const multer = require("multer")
const path = require("path")
const fs = require("fs")

const models = require("../models/index")
const Menu = models.menu

const checkFileType = function(file, cb){
    const fileTypes = /jpeg|jpg|png|gif|svg/;

    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase);

    const mimeType = fileTypes.test(file.mimeType);

    if (mimeType && extName){
        return cb(null,true);
    }else{
        cb("Error: you can only upload image!!")
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./image/product")
    },
    filename: (req, file, cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
    }
})
let upload = multer({ 
    storage: storage,
    limits: {fileSize: 10000000},
    // fileFilter: (req, file, cb) =>{
    //     checkFileType(file, cb);
    // }
 })

// end-point akses data menu
app.get("/", (req, res) => {
    // create sql query
    let sql = "select * from menu"


    // run query
    db.query(sql, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                count: result.length, // jumlah data
                menu: result // isi data
            }
        }
        res.json(response) // send response
    })
})



//endpoint register
app.post("/register", upload.single("foto"), (req, res) => {
    // prepare data
    let data
    if (!req.file) {
        data = {
            message: "No uploaded file"
        }
    } else {
        data = {
            nama_menu: req.body.nama_menu,
            jenis: req.body.jenis,
            deskripsi: req.body.deskripsi,
            harga: req.body.harga,
            foto: req.file.filename,
        }

        Menu.create(data)
            .then(result => {
                res.json({
                    msg: "succes"
                })
            })
            .catch(err => {
                res.json({
                    msg:err.message
                })
            })
        // create sql query insert
        let sql = "insert into menu set ?"


        // // run query
        db.query(sql, data, (error, result) => {
            let response = null
            if (error) {
                response = {
                    message: error.message
                }
            } else {
                response = {
                    message: result.affectedRows + " data has been inserted"
                }
            }
            res.json(response) // send response
        })
    }

    res.json(data)
})

module.exports = app