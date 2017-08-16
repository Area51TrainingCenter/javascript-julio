const nombre = "Sergio"
const apellido = "Hidalgo"

class Perro {
    constructor(nombreAnimal){
        this.nombreAnimal = nombreAnimal
    }
    nombre(){
        console.log(`El nombre es ${this.nombreAnimal}`)
    }
}

const perro = new Perro("Dandy")
perro.nombre()