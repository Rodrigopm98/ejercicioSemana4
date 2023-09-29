import { createRequire } from 'node:module'
import express from 'express'

const require = createRequire(import.meta.url)
const datos = require('./datos.json')

const app = express()

const expossedPort = 1234

app.get('/', (req, res)=>{
    res.status(200).send('pagina de inicio')
})

//OBTIENE LOS PRODUCTOS

app.get('/productos', (req, res)=>{
   const productos = datos.productos
   res.send(productos).json(productos)
})

//OBTIENE LOS USUARIOS

app.get('/usuarios', (req, res)=>{
    try{const usuarios = datos.usuarios
    res.send(usuarios).json(usuarios)
}catch(error){
    res.status(204).json({'message': error})
}
 })

//OBTIENE SOLO EL USUARIO BUSCADO POR ID

app.get('/usuarios/:id', (req, res) => {
  try{ 
    let usuarioId = parseInt(req.params.id)
    let usuario = datos.usuarios.find((usuario)=>{
    return usuario.id === usuarioId
   })
   if(!usuario){
    res.status(204).json({'menssage': 'Producto no encontrado'})
   }
   res.status(200).send(usuario).json(usuario)
}catch(error){
    res.status(204).json({'message': error})
} 
})


//PARA AGREGAR UN NUEVO USUARIO

app.post('/usuarios', (req, res)=>{
    try{
        let bodyTemp = ''
        req.on('data', (chunk)=>{
            bodyTemp += chunk.toString()
        })

        req.on('end', ()=>{
            const data = JSON.parse(bodyTemp)
            req.body = data
            datos.usuarios.push(req.body)
        })
        res.status(201).json({'messege': "Usuario Agregado"})

    } catch(error){
        res.status(204).json({'message': 'error'})
    }
})

//MODIFICAR ATRIBUTO DE ALGÚN USUARIO

app.patch('/usuarios/:id', (req, res)=>{
    let idUsuarioAEditar = parseInt(req.params.id)
    let usuarioAActualizar = datos.usuarios.find((usuario)=>{
        return usuario.id === idUsuarioAEditar
    })

    let bodyTemp = ''

    req.on('data', (chunk) => {
        bodyTemp += chunk.toString()
    })

    req.on('end', () => {
        const data = JSON.parse(bodyTemp)
        req.body = data

        if(data.nombre){
            usuarioAActualizar.nombre = data.nombre
        }

        if(data.edad){
            usuarioAActualizar.edad = data.edad
        }

        if(data.email){
            usuarioAActualizar.email = data.email
        }

        if(data.telefono){
            usuarioAActualizar.telefono = data.telefono
        }

        res.status(200).send('Usaurio modificado correctamente')

    })
})



//PARA ELIMINAR USUARIO BUSCADO POR ID
app.delete('/usuarios/:id', (req, res) => {
    let idUsuarioABorrar = parseInt(req.params.id)
    let usuarioABorrar = datos.usuarios.find((usuario) => usuario.id === idUsuarioABorrar)

    if (!usuarioABorrar){
        res.status(204).json({"message":"Usuario no encontrado"})
    }

    let indiceUsuarioABorrar = datos.usuarios.indexOf(usuarioABorrar)
    try {
         datos.usuarios.splice(indiceUsuarioABorrar, 1)
    res.status(200).json({"message": "Usuario borrado"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

//OBTENER EL PRECIO DE UN PRODUCTO QUE SE INGRESA POR ID
app.get('/precioProducto/:idprice', (req, res) => {
    try {
        let productoId = parseInt(req.params.id)
        let productoEncontrado = datos.productos.find((producto) => producto.id === productoId)

        if (!productoEncontrado) {
            res.status(204).json({ "message": "Producto no encontrado"})
        }
        res.status(200).json({'precio': productoEncontrado.precio})

    } catch (error) {
        res.status(204).json({"message": error})
    }
})

app.get('/nombreProducto/:id', (req, res) => {
    try {
        let productoId = parseInt(req.params.id)
        let productoEncontrado = datos.productos.find((producto) => producto.id === productoId)

        if (!productoEncontrado) {
            res.status(204).json({ "message": "Producto no encontrado"})
        }
        res.status(200).json({'nombreProducto': productoEncontrado.nombre})

    } catch (error) {
        res.status(204).json({"message": error})
    }
})

app.get('/telefonoUsuario/:id', (req, res) => {
    try {
        let usuarioId = parseInt(req.params.id)
        let usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId)

        if (!usuarioEncontrado) {
            res.status(204).json({ "message": "Usuario no encontrado"})
        }
        res.status(200).json({'telefono': usuarioEncontrado.telefono})

    } catch (error) {
        res.status(204).json({"message": error})
    }
})


app.get('/nombreUsuario/:id', (req, res) => {
    try {
        let usuarioId = parseInt(req.params.id)
        let usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId)

        if (!usuarioEncontrado) {
            res.status(204).json({ "message": "Usuario no encontrado"})
        }
        res.status(200).json({'nombre': usuarioEncontrado.nombre})

    } catch (error) {
        res.status(204).json({"message": error})
    }
})


app.use((req, res)=>{
    res.status(404).send("error 404")
})

app.listen(expossedPort, ()=>{
    console.log('Servidor escuchando en http://localhost:'+ expossedPort)
})

