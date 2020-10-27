const request = require('supertest')
const mongoose = require('mongoose')
const statusCode = require('http-status-codes')
const Idioma = require('../../models/idioma.model')
const message = require('../../utils/message')
const {clearDB} = require('../utils')

const app = require('../../app')

const url = "/api/v1/idiomas/"

describe('/api/v1/idiomas', () => {
    describe('GET /', () => {
        beforeAll(async () => {          
          await clearDB()
          await Idioma.create({ nombre: 'Idioma 1'})  
        })
  
        it("debe devolver todos los idiomas", async () => {        
          const res = await request(app).get(url)
            
          expect(res.statusCode).toBe(statusCode.OK)
          expect(res.body.status).toBe(message.SUCCESS)
          expect(res.body.results).toBeDefined()            
          expect(res.body.results).toBe(1)          
          expect(res.body.data.idiomas[0]['nombre']).toBe('Idioma 1')          
        })  
        
        it("debe devolver el total de idiomas registrados", async () => {    
          const res = await request(app).get(url + 'contar')

          expect(res.statusCode).toBe(statusCode.OK)
          expect(res.body.status).toBe(message.SUCCESS)           
          expect(res.body.data.count).toBe(1)
        })
    })

    describe('GET /:id', () => {
        let idioma
  
        beforeAll(async () => {
          await clearDB()
          idioma = await Idioma.create({ nombre: 'Idioma 1'})  
        })
  
        it("debe devolver un idioma", async() => {
          const res = await request(app).get(url + idioma._id)
  
          expect(res.statusCode).toBe(statusCode.OK)
          expect(res.body.status).toBe(message.SUCCESS)           
          expect(res.body.data.idioma.nombre).toBe(idioma.nombre)        
          expect(res.body.data.idioma._id).toBeDefined()         
        })
  
        it("debe devolver un error 404 si el id está mal formado", async() => {
          const id = mongoose.Types.ObjectId()
          const res = await request(app).get(url + id)
  
          expect(res.statusCode).toBe(statusCode.NOT_FOUND)
        })
  
        it("debe devolver un error 400 si no existe el idioma", async() => {
          const res = await request(app).get(url + '1')
  
          expect(res.statusCode).toBe(statusCode.BAD_REQUEST)    
        })  
      })   
  
      describe('POST /', () => {
        let idioma = { nombre: "Idioma 1" }
  
        beforeAll(async () => {
          await clearDB()        
        })
  
        it("debe devolver un idioma", async () => {
          const res = await request(app).post(url).send(idioma)
  
          expect(res.statusCode).toBe(statusCode.CREATED)
          expect(res.body.status).toBe(message.SUCCESS)
          expect(res.body.message).toBe(message.IDIOMA_REGISTRADO)
          expect(res.body.data.idioma.nombre).toBe(idioma.nombre)   
          expect(res.body.data.idioma._id).toBeDefined()        
        })
  
        it("debe devolver un error 400 cuando no se facilita el nombre del idioma", async () => {
          idioma.nombre = ""
          const res = await request(app).post(url).send(idioma)
  
          expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
          expect(res.body.success).toBeFalsy()
          expect(res.body.error).toBe(message.NOMBRE_REQUERIDO)
        })
  
        it("debe devolver un error 400 si el idioma ya existe", async () => {        
          await request(app).post(url).send(idioma)
          const res = await request(app).post(url).send(idioma)
  
          expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
          expect(res.body.success).toBeFalsy()
        })
      })
  
      describe('PUT /:id', () => {
        let idIdioma1
        let idIdioma2
        let idioma
  
        beforeAll(async () => {
          await clearDB()
          const idioma1 = await Idioma.create({ nombre: 'Idioma 1' })  
          const idioma2 = await Idioma.create({ nombre: 'Idioma 2' })  
          idIdioma1 = idioma1._id
          idIdioma2 = idioma2._id
        })
  
        it("debe actualizar un idioma con éxito", async() => {
          idioma = { nombre: "Idioma 3" }
          const res = await request(app).put(url + idIdioma1).send(idioma)
  
          expect(res.statusCode).toBe(statusCode.OK)
          expect(res.body.status).toBe(message.SUCCESS)   
          expect(res.body.data.idioma._id).toBeDefined()
          expect(res.body.data.idioma.nombre).toBe(idioma.nombre)    
        })  
  
        it("debe dar un error 400 si actualizamos un idioma sin nombre", async() => {
          idioma = { nombre: "" }
          const res = await request(app).put(url + idIdioma1).send(idioma)
  
          expect(res.statusCode).toBe(statusCode.BAD_REQUEST)
          expect(res.body.success).toBeFalsy()    
          expect(res.body.error).toBe(message.NOMBRE_REQUERIDO)        
        })  
      })
})