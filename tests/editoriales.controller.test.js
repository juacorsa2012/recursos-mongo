const request = require('supertest')
const mongoose = require('mongoose')
const statusCode = require('http-status-codes')
const Editorial = require('../models/editorial.model')
const message = require('../utils/message')
const {clearDB} = require('./utils')

const app = require('../app')
const e = require('express')

const url = "/api/v1/editoriales/"

describe('/api/v1/editoriales', () => {
    describe('GET /', () => {
        beforeAll(async () => {          
          await clearDB()
          await Editorial.create({ nombre: 'Editorial 1'})  
        })
  
        it("debe devolver todos las editoriales", async () => {        
          const res = await request(app).get(url)
            
          expect(res.statusCode).toBe(statusCode.OK)
          expect(res.body.status).toBe(message.SUCCESS)
          expect(res.body.results).toBeDefined()            
          expect(res.body.results).toBe(1)          
          expect(res.body.data.editoriales[0]['nombre']).toBe('Editorial 1')          
        })  
        
        it("debe devolver el total de editoriales registradas", async () => {    
          const res = await request(app).get(url + 'contar')

          expect(res.statusCode).toBe(statusCode.OK)
          expect(res.body.status).toBe(message.SUCCESS)           
          expect(res.body.data.count).toBe(1)
        })
    })

    describe('GET /:id', () => {
        let editorial
  
        beforeAll(async () => {
          await clearDB()
          editorial = await Editorial.create({ nombre: 'Editorial 1'})  
        })
  
        it("debe devolver una editorial", async() => {
          const res = await request(app).get(url + editorial._id)
  
          expect(res.statusCode).toBe(statusCode.OK)
          expect(res.body.status).toBe(message.SUCCESS)           
          expect(res.body.data.editorial.nombre).toBe(editorial.nombre)        
          expect(res.body.data.editorial._id).toBeDefined()         
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
        let editorial = { nombre: "Editorial 1" }
  
        beforeAll(async () => {
          await clearDB()        
        })
  
        it("debe devolver una editorial", async () => {
          const res = await request(app).post(url).send(editorial)
  
          expect(res.statusCode).toBe(statusCode.CREATED)
          expect(res.body.status).toBe(message.SUCCESS)
          expect(res.body.message).toBe(message.EDITORIAL_REGISTRADA)
          expect(res.body.data.editorial.nombre).toBe(editorial.nombre)   
          expect(res.body.data.editorial._id).toBeDefined()        
        })
  
        it("debe devolver un error 400 cuando no se facilita el nombre de la editorial", async () => {
          editorial.nombre = ""
          const res = await request(app).post(url).send(editorial)
  
          expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
          expect(res.body.success).toBeFalsy()
          expect(res.body.error).toBe(message.NOMBRE_REQUERIDO)
        })
  
        it("debe devolver un error 400 si el tema ya existe", async () => {        
          await request(app).post(url).send(editorial)
          const res = await request(app).post(url).send(editorial)
  
          expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
          expect(res.body.success).toBeFalsy()
        })
      })
  
      describe('PUT /:id', () => {
        let idEditorial1
        let idEditorial2
        let editorial
  
        beforeAll(async () => {
          await clearDB()
          const editorial1 = await Editorial.create({ nombre: 'Editorial 1' })  
          const editorial2 = await Editorial.create({ nombre: 'Editorial 2' })  
          idEditorial1 = editorial1._id
          idEditorial2 = editorial2._id
        })
  
        it("debe actualizar una editorial con éxito", async() => {
          editorial = { nombre: "Editorial 3" }
          const res = await request(app).put(url + idEditorial1).send(editorial)
  
          expect(res.statusCode).toBe(statusCode.OK)
          expect(res.body.status).toBe(message.SUCCESS)     
          expect(res.body.data.editorial._id).toBeDefined()
          expect(res.body.data.editorial.nombre).toBe(editorial.nombre)    
        })  
  
        it("debe dar un error 400 si actualizamos una editorial sin nombre", async() => {
          editorial = { nombre: "" }
          const res = await request(app).put(url + idEditorial1).send(editorial)
  
          expect(res.statusCode).toBe(statusCode.BAD_REQUEST)
          expect(res.body.success).toBeFalsy()    
          expect(res.body.error).toBe(message.NOMBRE_REQUERIDO)        
        })  
      })
})
