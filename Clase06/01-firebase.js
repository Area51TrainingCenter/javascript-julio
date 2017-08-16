const inpCorreo = document.querySelector("#inpCorreo"),
      inpContrasena = document.querySelector("#inpContrasena"),
      inpNombreAlumno = document.querySelector("#inpNombreAlumno"),
      inpEdad = document.querySelector("#inpEdad"),
      btnIngresar = document.querySelector("#btnIngresar"),
      btnRegistrar = document.querySelector("#btnRegistrar"),
      btnCerrarSesion = document.querySelector("#btnCerrarSesion"),
      btnAgregarAlumno = document.querySelector("#btnAgregarAlumno"),
      btnActualizar = document.querySelector("#btnActualizar"),
      btnCancelar = document.querySelector("#btnCancelar"),
      pnlLogin = document.querySelector(".zona.login"),
      pnlListado = document.querySelector(".zona.listado"),
      pnlCabecera = document.querySelector("header"),
      tbody = document.querySelector("tbody")

const bd = firebase
                .database()
                .ref("/alumnos")

let lista, id

btnIngresar.addEventListener("click", e => {
    e.preventDefault()

    const datos = {}
    datos.correo = inpCorreo.value
    datos.contrasena = inpContrasena.value

    firebase
        .auth()
        .signInWithEmailAndPassword(datos.correo, datos.contrasena)
        .then(msg => {
            console.log(msg)
        })
        .catch(error => {
            console.log(error)
        })
          
})

btnRegistrar.addEventListener("click", e => {
    e.preventDefault()

    const datos = {}
    datos.correo = inpCorreo.value
    datos.contrasena = inpContrasena.value

    firebase
        .auth()
        .createUserWithEmailAndPassword(datos.correo, datos.contrasena)
        .then(msg => {
            console.log(msg)
        })
        .catch(error => {
            console.log(error)
        })
})

btnCerrarSesion.addEventListener("click", e => {
    e.preventDefault()

    firebase
        .auth()
        .signOut()
})

btnAgregarAlumno.addEventListener("click", e => {
    e.preventDefault()

    const nombreAlumno = inpNombreAlumno.value,
          edad = inpEdad.value

    bd.push().set({nombreAlumno, edad})
})

btnCancelar.addEventListener("click", e => {
    e.preventDefault()
    btnActualizar.style.display = "none"
    btnCancelar.style.display = "none"
    btnAgregarAlumno.style.display = "block"
    inpNombreAlumno.value = ""
    inpEdad.value = 0
})

btnActualizar.addEventListener("click", e => {
    e.preventDefault()

    const nombreAlumno = inpNombreAlumno.value,
          edad = inpEdad.value

    bd
        .child(id)
        .update({nombreAlumno, edad})
        .then(msg => {
            btnActualizar.style.display = "none"
            btnCancelar.style.display = "none"
            btnAgregarAlumno.style.display = "block"
            inpNombreAlumno.value = ""
            inpEdad.value = 0
        })
})



bd.on("value", alumnos => {
    lista = alumnos.val()

    let filas = ""
    for(let item in lista) {
        filas += `
            <tr>
                <td>${item}</td>
                <td>${lista[item].nombreAlumno}</td>  
                <td>${lista[item].edad ? lista[item].edad : ''}</td>
                <td>
                    <a href="#" class="btn btn-info editar" data-id="${item}">Editar</a>
                    <a href="#" class="btn btn-danger eliminar" data-id="${item}">Eliminar</a>
                </td>
            </tr>
        `
    }
    tbody.innerHTML = filas

    const botonesEditar = document.querySelectorAll(".editar"),
          botonesEliminar = document.querySelectorAll(".eliminar")

    const editar = function(e) {
        e.preventDefault()

        id = this.getAttribute("data-id")

        inpNombreAlumno.value = lista[id].nombreAlumno
        inpEdad.value = lista[id].edad

        btnCancelar.style.display = "block"
        btnActualizar.style.display = "block"
        btnAgregarAlumno.style.display = "none"
    }

    const eliminar = function(e) {
        e.preventDefault()

        const id = this.getAttribute("data-id")

        if(confirm("¿Está seguro de querer eliminar?")){
            bd
                .child(id)
                .remove()
        }


    }

    botonesEditar.forEach(elem => {
        elem.addEventListener("click", editar)
    })

    botonesEliminar.forEach(elem => {
        elem.addEventListener("click", eliminar)
    })
})


firebase
    .auth()
    .onAuthStateChanged(usuario => {
        if(usuario) {
            pnlLogin.style.display = "none"
            pnlListado.style.display = "block"
            pnlCabecera.style.display = "block"
        } else {
            pnlLogin.style.display = "block"
            pnlListado.style.display = "none"
            pnlCabecera.style.display = "none"
        }

    })