import { createRequire } from 'node:module'
import express from 'express'
import db from './db/connections.js'
import Producto from './models/producto.js'
import Usuario from './models/usuario.js'

try {
    await db.authenticate()
    console.log("coneccion establecida correctamente")
    
} catch (error) {
    console.error("error en la coneccion a la DB ", error)
    
}

const require = createRequire(import.meta.url)
const datos = require('./datos.json')

const app = express()

const expossedPort = 1234

app.get('/', (req, res)=>{
    res.status(200).send('pagina de inicio')
})

//OBTIENE LOS PRODUCTOS

app.get('/productos', async (req, res)=>{
    try {
        let allProducts = await Producto.findAll()
        res.status(200).json(allProducts)
    } catch (error) {
        res.status(204).json({"message" : error})
    }
})

//OBTIENE LOS USUARIOS

app.get('/usuarios', async (req, res)=>{
    try {
        let allUsers = await Usuario.findAll()
        res.status(200).json(allUsers)
    } catch (error) {
        res.status(204).json({"message" : error})
    }
 })

//OBTIENE SOLO EL USUARIO BUSCADO POR ID
// Problemaaa a resolver
app.get('/usuarios/:id', async (req, res) => {
  try{ 
    let idUser = await Usuario.findByPk(req.params.id)
    if(idUser != null){
        res.status(200).json(idUser)
    }else{
        res.status(204).json("usuario no encontrado")
    }
}catch(error){
    res.status(201).json({'message': error})
} 
})


//PARA AGREGAR UN NUEVO USUARIO

app.post('/usuarios', (req, res)=>{
    try{
        let bodyTemp = ''
        req.on('data', (chunk)=>{
            bodyTemp += chunk.toString()
        })

        req.on('end',async ()=>{
            const data = JSON.parse(bodyTemp)
            req.body = data
            const usuarioAGuardar = new Usuario(req.body)
            await usuarioAGuardar.save()
        })
        res.status(201).json({'messege': "Usuario Agregado"})

    } catch(error){
        res.status(204).json({'message': 'error'})
    }
})

//MODIFICAR ATRIBUTO DE ALGÚN USUARIO

app.patch('/usuarios/:id', async (req, res)=>{
    let idUsuarioAEditar = parseInt(req.params.id)

    try {
        let usuarioAActualizar = await Usuario.findByPk(idUsuarioAEditar)
        if(!usuarioAActualizar){
            return res.status(204).json({"message": "Usuario no encontrado"})
        }

        let bodyTemp = ''

        req.on('data', (chunk) => {
            bodyTemp += chunk.toString()
        })
    
        req.on('end', async () => {
            const data = JSON.parse(bodyTemp)
            req.body = data
            await usuarioAActualizar.update(req.body)
            res.status(200).send('Usaurio modificado correctamente')
    
        })

        
    } catch (error) {
      res.status(204).json({"message" : error})  
    }
})



//PARA ELIMINAR USUARIO BUSCADO POR ID
app.delete('/usuarios/:id', async (req, res) => {
    let idUsuarioABorrar = parseInt(req.params.id)
    try {
        let usuarioABorrar = await Usuario.findByPk(idUsuarioABorrar)
        if(!usuarioABorrar){
            return res.status(204).json({"message":"Usuario no encontrado"})
        }
        await usuarioABorrar.destroy()
        res.status(200).json({message: "Usuario borrado"})
    } catch (error) {
        res.status(204).json({"message" : error})
    }
})


app.use((req, res)=>{
    res.status(404).send("error 404")
})

app.listen(expossedPort, ()=>{
    console.log('Servidor escuchando en http://localhost:'+ expossedPort)
})

