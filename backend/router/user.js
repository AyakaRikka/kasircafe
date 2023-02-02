const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config") //import konfigurasi database
const md5 = require("md5") //mengubah password menjadi format md5
const Cryptr = require("cryptr")
const crypt = new Cryptr("140533602676") //secret key, boleh diganti :)


const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const models = require("../models/index")
const user = models.user

//import auth
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "KasirCafe"


// app.post("/auth", async (req,res) => {
//     let params = {
//         username: req.body.username,
//         password: md5(req.body.password)
//     }


//     let result = await user.findOne({where: params})
//     if(result){
        
//         let payload = JSON.stringify(result)
//         // generate token
//         let token = jwt.sign(payload, SECRET_KEY)
//         res.json({
//             logged: true,
//             data: result,
//             token: token
//         })
//     }else{
//         res.json({
//             logged: false,
//             message: "Invalid username or password"
//         })
//     }
// })
// //endpoint menampilkan semua data admin, method: GET, function: findAll()
// app.get("/login", auth, (req,res) => {
//     user.findAll()
//         .then(result => {
//             res.json({
//                 user : result
//             })
//         })
//         .catch(error => {
//             res.json({
//                 message: error.message
//             })
//         })
// })

// endpoint login user (authentication)
app.post("/login", (req, res) => {
    // tampung username dan password
    let param = [
        req.body.username, //username
        md5(req.body.password) // password
    ]
    
    // create sql query
    let sql = "select * from user where username = ? and password = ?"


    // run query
    db.query(sql, param, (error, result) => {
        if (error) throw error


        // cek jumlah data hasil query
        if (result.length > 0) {
            // user tersedia
            res.json({
                message: "Logged",
                token: crypt.encrypt(result[0].id_user), // generate token
                data: result
            })
        } else {
            // user tidak tersedia
            res.json({
                message: "Invalid username/password"
            })
        }
    })
})


// end-point akses data siswa
app.get("/", (req, res) => {
    // create sql query
    let sql = "select * from user"


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
                user: result // isi data
            }            
        }
        res.json(response) // send response
    })
})



//endpoint register
app.post("/register", (req,res) => {
    // prepare data
    let data = {
        nama_user: req.body.nama_user,
        username: req.body.username,
        password: md5(req.body.password),
        role: req.body.role,
    }


    // create sql query insert
    let sql = "insert into user set ?"


    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " user registered"
            }
        }
        res.json(response) // send response
    })
})
// end-point mengubah data siswa
app.put("/:id", (req,res) => {


    // prepare data
    let data = [
        // data
        {
            nama_user: req.body.nama_user,
            username: req.body.username,
            password: req.body.password,
            role: req.body.role,
        },


        // parameter (primary key)
        {
            id_user: req.params.id
        }
    ]


    // create sql query update
    let sql = "update user set ? where ?"


    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data updated"
            }
        }
        res.json(response) // send response
    })
    
})
module.exports = app