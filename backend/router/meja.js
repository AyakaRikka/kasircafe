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

// end-point akses data siswa
app.get("/", (req, res) => {
    // create sql query
    let sql = "select * from meja"


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
                meja: result // isi data
            }            
        }
        res.json(response) // send response
    })
})



//endpoint register
app.post("/add", (req,res) => {
    // prepare data
    let data = {
        nomor_meja: req.body.nomor_meja,
    }


    // create sql query insert
    let sql = "insert into meja set ?"


    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " add table"
            }
        }
        res.json(response) // send response
    })
})
module.exports = app