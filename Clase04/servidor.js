// Configuración
const puerto = 1337
const palabraSecreta = "adj#8kdW1899?9dlPor$$23#"
const tiempoVidaToken = 20*60

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

const registros = [
    {id: 1, nombre: "Melissa", apellido: "Villena"},
    {id: 2, nombre: "Elder", apellido: "Vásquez"},
    {id: 3, nombre: "Pedro", apellido: "Castillo"},
    {id: 4, nombre: "Jana", apellido: "Merino"}
]

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

passport.use("local", new estrategiaLocal(
    {
        usernameField: "usuario",
        passwordField: "contrasena"
    },
    (usuario, contrasena, done) => {
        controlador.autenticar(usuario, contrasena, done)
    }
))

app.get("/", (req, res, next)=>{
    res.sendFile(`${__dirname}/04-filtrar.html`)
    /*res.json({
        nombre: "Sergio"
    })*/
})

const proteccion = expressJwt({
    secret: palabraSecreta
})

app.get("/listar", proteccion, (req, res, next) => {
    res.json({
        registros
    })
})

app.post("/listarFiltro", (req, res, next) => {
    const filtro = req.body.filtro

    if(filtro!="") {
        const registrosFiltrados = registros.filter(
            item => {
                const cond01 = item.nombre.toUpperCase().indexOf(filtro.toUpperCase())>-1
                const cond02 = item.apellido.toUpperCase().indexOf(filtro.toUpperCase())>-1
                return cond01 || cond02
            }
        )
        res.json(registrosFiltrados)
    } else {
        res.json(registros)
    }
})

app.get("/listarFiltro/:filtro", (req, res, next) => {
    const filtro = req.params.filtro

    if(filtro!="-") {
        const registrosFiltrados = registros.filter(
            item => {
                const cond01 = item.nombre.toUpperCase().indexOf(filtro.toUpperCase())>-1
                const cond02 = item.apellido.toUpperCase().indexOf(filtro.toUpperCase())>-1
                return cond01 || cond02
            }
        )
        res.json(registrosFiltrados)
    } else {
        res.json(registros)
    }
})

const mostrarRegistros = (req, res, next) => {
    res.json({
        token: req.token,
        nombre: req.user.nombre
    })
}

const serializar = (req, res, next) => {
    controlador.actualizarOCrear(req.user,  (error, usuario) =>{
        if(error) {
            return next(error)
        }

        // Ejecutar cualquier procedimiento contra la base de datos

        req.user.sexo = 1
        req.user.fechaCumpleanos = "10/02/80"

        next()
    })
}

const generarToken = (req, res, next) => {
    req.token = jwt.sign(
        {
            id: req.user.id
        },
        palabraSecreta,
        {
            expiresIn: tiempoVidaToken
        }
    )

    next()
}


app.post("/auth", passport.initialize(), passport.authenticate(
    "local",
    {
        session: false,
        scope: []
    }
), serializar, generarToken, mostrarRegistros)



http.createServer(app).listen(puerto, ()=>{
    console.log(`Servidor ejecutándose en el puerto ${puerto}`)
})

