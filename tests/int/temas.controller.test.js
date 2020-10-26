const request = require('supertest')
const mongoose = require('mongoose')
const statusCode = require('http-status-codes')
const Tema = require('../../models/tema.model')
const message = require('../../utils/message')
const {clearDB} = require('../utils')

const app = require('../../app')

const url = "/api/v1/temas/"

describe('/api/v1/temas', () => {
    describe('GET /', () => {
        beforeAll(async () => {          
          await clearDB()
          await Tema.create({ nombre: 'Tema 1'})  
        })
  
        it("debe devolver todos los temas", async () => {        
          const res = await request(app).get(url)
            
          expect(res.statusCode).toBe(statusCode.OK)
          expect(res.body.status).toBe(message.SUCCESS)
          expect(res.body.results).toBeDefined()            
          expect(res.body.results).toBe(1)          
          expect(res.body.data.temas[0]['nombre']).toBe('Tema 1')          
        })  
        
        it("debe devolver el total de temas registrados", async () => {    
          const res = await request(app).get(url + 'contar')

          expect(res.statusCode).toBe(statusCode.OK)
          expect(res.body.status).toBe(message.SUCCESS)           
          expect(res.body.data.count).toBe(1)
        })
    })
    
    describe('GET /:id', () => {
      let tema

      beforeAll(async () => {
        await clearDB()
        tema = await Tema.create({ nombre: 'Tema 1'})  
      })

      it("debe devolver un tema", async() => {
        const res = await request(app).get(url + tema._id)

        expect(res.statusCode).toBe(statusCode.OK)
        expect(res.body.status).toBe(message.SUCCESS)           
        expect(res.body.data.tema.nombre).toBe(tema.nombre)        
        expect(res.body.data.tema._id).toBeDefined()         
      })

      it("debe devolver un error 404 si el id está mal formado", async() => {
        const id = mongoose.Types.ObjectId()
        const res = await request(app).get(url + id)

        expect(res.statusCode).toBe(statusCode.NOT_FOUND)
      })

      it("debe devolver un error 400 si no existe el tema", async() => {
        const res = await request(app).get(url + '1')

        expect(res.statusCode).toBe(statusCode.BAD_REQUEST)    
      })  
    })   

    describe('POST /', () => {
      let tema = { nombre: "Tema 1" }

      beforeAll(async () => {
        await clearDB()        
      })

      it("debe devolver un tema", async () => {
        const res = await request(app).post(url).send(tema)

        expect(res.statusCode).toBe(statusCode.CREATED)
        expect(res.body.status).toBe(message.SUCCESS)
        expect(res.body.message).toBe(message.TEMA_REGISTRADO)
        expect(res.body.data.tema.nombre).toBe(tema.nombre)   
        expect(res.body.data.tema._id).toBeDefined()        
      })

      it("debe devolver un error 400 cuando no se facilita el nombre del tema", async () => {
        tema.nombre = ""
        const res = await request(app).post(url).send(tema)

        expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
        expect(res.body.success).toBeFalsy()
        expect(res.body.error).toBe(message.NOMBRE_REQUERIDO)
      })

      it("debe devolver un error 400 si el tema ya existe", async () => {        
        await request(app).post(url).send(tema)
        const res = await request(app).post(url).send(tema)

        expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
        expect(res.body.success).toBeFalsy()
      })
    })

    describe('PUT /:id', () => {
      let idTema1
      let idTema2
      let tema    

      beforeAll(async () => {
        await clearDB()
        const tema1 = await Tema.create({ nombre: 'Tema 1' })  
        const tema2 = await Tema.create({ nombre: 'Tema 2' })  
        idTema1 = tema1._id
        idTema2 = tema2._id
      })

      it("debe actualizar un tema con éxito", async() => {
        tema = { nombre: "Tema 3" }
        const res = await request(app).put(url + idTema1).send(tema)

        expect(res.statusCode).toBe(statusCode.OK)
        expect(res.body.status).toBe(message.SUCCESS)   
        expect(res.body.data.tema._id).toBeDefined()
        expect(res.body.data.tema.nombre).toBe(tema.nombre)    
      })  

      it("debe dar un error 400 si actualizamos un tema sin nombre", async() => {
        tema = { nombre: "" }
        const res = await request(app).put(url + idTema1).send(tema)

        expect(res.statusCode).toBe(statusCode.BAD_REQUEST)
        expect(res.body.success).toBeFalsy()    
        expect(res.body.error).toBe(message.NOMBRE_REQUERIDO)        
      })  
    })
})