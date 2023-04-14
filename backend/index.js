const express = require("express")
require("dotenv").config()
const cors = require("cors")
const { connection } = require("./Config/db")
const { userRouter } = require("./Routes/user.route")
// const multer = require('multer');
// const upload = multer({dest:'uploads/'})

const app = express()
const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(cors());
app.use("/", express.static("uploads"))

app.get("/", (req, res)=>{
    res.send("Welcome to the home page of social photo sharing app")
})

app.use("/", userRouter)

app.listen(PORT, async (req, res)=>{
    try{
        await connection
        console.log("Connecting to db successful")
    }
    catch(err){
        console.log("Error connecting to db")
        console.log(err)
    }
    console.log(`Listening on PORT ${PORT}`)
})