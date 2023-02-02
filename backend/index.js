//inisialisasi library
const express = require("express")
const app = express()
const Cryptr = require("cryptr")
const crypt = new Cryptr("140533602676") 
const db = require("./config")
// app.use(cors());

//import route user
const user = require("./router/user")
app.use("/user", user)


validateToken = () => {
    return (req, res, next) => {
        // cek keberadaan "Token" pada request header
        if (!req.get("Token")) {
            // jika "Token" tidak ada
            res.json({
                message: "Access Forbidden"
            })
        } else {
            // tampung nilai Token
            let token  = req.get("Token")
            
            // decrypt token menjadi id_user
            let decryptToken = crypt.decrypt(token)


            // sql cek id_user
            let sql = "select * from user where ?"


            // set parameter
            let param = { id_user: decryptToken}


            // run query
            db.query(sql, param, (error, result) => {
                if (error) throw error
                 // cek keberadaan id_user
                if (result.length > 0) {
                    // id_user tersedia
                    next()
                } else {
                    // jika user tidak tersedia
                    res.json({
                        message: "Invalid Token"
                    })
                }
            })
        }


    }
}


// //import route siswa
// const user = require("./router/user")
// app.use("/user", user)

const meja = require("./router/meja")
app.use("/meja",validateToken(), meja)

const menu = require("./router/menu")
app.use("/menu",validateToken(), menu)

//membuat web server dengan port 8000
app.listen(4040, () => {
    console.log("server run on port 4040")
})
