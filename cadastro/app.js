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

//rota pública
app.get("/", (req, res) => {
    res.status(200).json({msg:"Bem vindo a api"})
})

//rota privada
app.get("user/:id", checkToken, async (req,res) => {
    const id = req.params.id

    //ver se o usuário existe
    const user = await User.findById(id, "-password")

    if(!user){
        return res.status(404).json({msg:"Usuário não encontrado"})
    }

    res.status(200).json({user})

})

function checkToken(req,res,next){

    const authHeader = req.heades[`authorization`]
    const token = authHeader && authHeader.split("")
    
    if(!token){
        return res.status(401).json({msg:"Acesso negado!"})
    }
    try{
        const secret = process.env.SECRET
        jwt.verify(token,secret)

        next()

    }catch{
        return res.status(400).json({msg:"Token inv[alido!"})
    
    }

}


//registrar usuario
app.post("/auth/register", async (req, res) => {
    const {name, email, password, confirmpassword,telefone} = req.body

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
    if(!telefone) {
        return res.status(422).json({msg:"O telefone é obrigatório"})
    } 
    //ver se o usuario já existe
    const userExists = await User.findOne({email:email})
    if(userExists){
        return res.status(422).json({msg:"Esse usuário já existe"})
        
    }
    //criar senha 
    const salt = await bcrypt.genSalt(12)
    const passwordHash =  await bcrypt.hash(password,salt)

    //create user
    const user = new User({
        name,
        email,
        password: passwordHash
    })
    try{
        await user.save()

        res.status(201).json({msg:"usuario criado com sucesso"})

    }catch(error){
        console.log(error)
        res.status(500).json({msg:"Houve um erro no servidor"})
    }

})

//login
app.post("/auth/login", async (req,res) => {
    const {email,password} = req.body

    //validação
    if(!email) {
        return res.status(422).json({msg:"O nome é obrigatório"})
    }
    if(!password) {
        return res.status(422).json({msg:"O email é obrigatório"})
    }   
    //ver se há esse login
    const user = await User.findOne({email:email})
    if(!user){
        return res.status(404).json({msg:"Usuario não cadastrado"})
        
    }
    
    //validar senha 
    const checkPassword = await bcrypt.compare(password,user.password)

    if(!checkPassword){
        return res.status(422).json({msg:"Senha incorreta"})
    
    }

    try{
        const secret = process.env.SECRET

        const token = jwt.sign(
            {
                id: user._id
            },secret
        )
        res.status(200).json({msg:"Autenticação realizada com sucesso",token})    


    }catch{
        console.log(error)
        res.status(500).json({msg:"Houve um erro no servidor"})    
    }
})

//Credenciais
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS
//mudar dps
mongoose.connect(`mongodb+srv://lucascastelano27:santos2005@cluster0.m9om9o6.mongodb.net/authJWT?retryWrites=true&w=majority`).then(() => {
    app.listen(3001)
    console.log("Conectou ao banco!")
})
.catch((err) => console.log(err) )

