require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const app = express()

//config json responde
app.use(express.json())

//models 
const User= require("./models/User")

app.get("/", (req, res) => {
    res.status(200).json({msg:"Bem vindo a api"})
})

//registrar usuario
app.post("/auth/register", async(req, res) => {
    const {name, email, password, confirmpassword} = req.body

    //validar
    if(!name) {
        return res.status(422).json({msg:"O nome é obrigatório"})
    }
    if(!email) {
        return res.status(422).json({msg:"O email é obrigatório"})
    }
    if(!password) {
        return res.status(422).json({msg:"A senha é obrigatória"})
    }
    if(password !== confirmpassword){
        return res.status(422).json({msg:"As senha não estão iguais"})
    } 
    //ver se o usuario já existe
    const userExists = await User.findOne({email:email})
    if(userExists){
        return res.status(422).json({msg:"Esse usuário já existe"})
        
    }
})

//Credenciais
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS
//mudar dps
mongoose.connect(`mongodb+srv://lucascastelano27:santos2005@cluster0.m9om9o6.mongodb.net/authJWT?retryWrites=true&w=majority`).then(() => {
    app.listen(3000)
    console.log("Conectou ao banco!")
})
.catch((err) => console.log(err) )

