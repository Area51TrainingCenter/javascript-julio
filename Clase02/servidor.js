// Configuración
const puerto = 1337

// Módulos
const bodyParser = require("body-parser") // parsea a json los datos enviados
const express = require("express") // es un framework de node
const expressJwt = require("express-jwt") // sirve para generar el token
const http = require("http") // sirve para crear un servidor web
const logger = require("morgan") // crea un log para ver la actividad del servidor
const jwt = require("jsonwebtoken") // da formato y valores al token
const passport = require("passport") // sirve para autenticar usuarios
const estrategiaLocal = require("passport-local").Strategy // valida usando usuario y contraseña

const app = express() // instanciar el framework express

const registros = ["Sergio", "Melissa", "Jana"]

const controlador = {
    actualizarOCrear: (usuario, cb)=>{
        cb(null, usuario)
    },
    autenticar: (usuario, contrasena, cb)=>{
        if(usuario=="sergio" && contrasena=="123"){
            cb(null, {
                id: 100,
                nombre: "Sergio",
                apellido: "Hidalgo",
                correo: "sergiohidalgocaceres@gmail.com"
            })
        } else {
            cb(null, false)
        }
    }
}




// Servidor
app.use(logger("dev")) // primer middleware
app.use(bodyParser.urlencoded({extended:false})) // encodifica para convertir a json
app.use(bodyParser.json()) // convertir los parámetros a json

app.use("local", new estrategiaLocal(
    {
        usernameField: "usuario",
        passwordField: "contrasena"
    },
    (usuario, contrasena, done) {
        controlador.autenticar(usuario, contrasena, done)
    }
))

app.get("/", (req, res, next)=>{
    res.sendFile(`${__dirname}/login.html`)
    /*res.json({
        nombre: "Sergio"
    })*/
})

app.get("/listar", (req, res, next) => {
    res.json({
        registros
    })
})



http.createServer(app).listen(puerto, ()=>{
    console.log(`Servidor ejecutándose en el puerto ${puerto}`)
})

