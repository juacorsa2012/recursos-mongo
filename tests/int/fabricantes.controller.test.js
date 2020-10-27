const request = require('supertest')
const mongoose = require('mongoose')
const statusCode = require('http-status-codes')
const Fabricante = require('../../models/fabricante.model')
const message = require('../../utils/message')
const {clearDB} = require('../utils')

const app = require('../../app')

const url = "/api/v1/fabricantes/"

describe('/api/v1/fabricantes', () => {
    describe('GET /', () => {
        beforeAll(async () => {          
          await clearDB()
          await Fabricante.create({ nombre: 'Fabricante 1'})  
        })
  
        it("debe devolver todos los fabricantes", async () => {        
          const res = await request(app).get(url)
            
          expect(res.statusCode).toBe(statusCode.OK)
          expect(res.body.status).toBe(message.SUCCESS)
          expect(res.body.results).toBeDefined()            
          expect(res.body.results).toBe(1)          
          expect(res.body.data.fabricantes[0]['nombre']).toBe('Fabricante 1')          
        })  
        
        it("debe devolver el total de fabricantes registrados", async () => {    
          const res = await request(app).get(url + 'contar')

          expect(res.statusCode).toBe(statusCode.OK)
          expect(res.body.status).toBe(message.SUCCESS)           
          expect(res.body.data.count).toBe(1)
        })
    })

    describe('GET /:id', () => {
        let fabricante
  
        beforeAll(async () => {
          await clearDB()
          fabricante = await Fabricante.create({ nombre: 'Fabricante 1'})  
        })
  
        it("debe devolver un fabricante", async() => {
          const res = await request(app).get(url + fabricante._id)
  
          expect(res.statusCode).toBe(statusCode.OK)
          expect(res.body.status).toBe(message.SUCCESS)           
          expect(res.body.data.fabricante.nombre).toBe(fabricante.nombre)        
          expect(res.body.data.fabricante._id).toBeDefined()         
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
        let fabricante = { nombre: "Fabricante 1" }
  
        beforeAll(async () => {
          await clearDB()        
        })
  
        it("debe devolver un fabricante", async () => {
          const res = await request(app).post(url).send(fabricante)
  
          expect(res.statusCode).toBe(statusCode.CREATED)
          expect(res.body.status).toBe(message.SUCCESS)
          expect(res.body.message).toBe(message.FABRICANTE_REGISTRADO)
          expect(res.body.data.fabricante.nombre).toBe(fabricante.nombre)   
          expect(res.body.data.fabricante._id).toBeDefined()        
        })
  
        it("debe devolver un error 400 cuando no se facilita el nombre del fabricante", async () => {
          fabricante.nombre = ""
          const res = await request(app).post(url).send(fabricante)
  
          expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
          expect(res.body.success).toBeFalsy()
          expect(res.body.error).toBe(message.NOMBRE_REQUERIDO)
        })
  
        it("debe devolver un error 400 si el fabricante ya existe", async () => {        
          await request(app).post(url).send(fabricante)
          const res = await request(app).post(url).send(fabricante)
  
          expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
          expect(res.body.success).toBeFalsy()
        })
      })

      describe('PUT /:id', () => {
        let idFabricante1
        let idFabricante2
        let fabricante
  
        beforeAll(async () => {
          await clearDB()
          const fabricante1 = await Fabricante.create({ nombre: 'Fabricante 1' })  
          const fabricante2 = await Fabricante.create({ nombre: 'Fabricante 2' })  
          idFabricante1 = fabricante1._id
          idFabricante2 = fabricante2._id
        })
  
        it("debe actualizar un fabricante con éxito", async() => {
          fabricante = { nombre: "Fabricante 3" }
          const res = await request(app).put(url + idFabricante1).send(fabricante)
  
          expect(res.statusCode).toBe(statusCode.OK)
          expect(res.body.status).toBe(message.SUCCESS)   
          expect(res.body.data.fabricante._id).toBeDefined()
          expect(res.body.data.fabricante.nombre).toBe(fabricante.nombre)
        })  
  
        it("debe dar un error 400 si actualizamos un fabricante sin nombre", async() => {
          fabricante = { nombre: "" }
          const res = await request(app).put(url + idFabricante1).send(fabricante)
  
          expect(res.statusCode).toBe(statusCode.BAD_REQUEST)
          expect(res.body.success).toBeFalsy()    
          expect(res.body.error).toBe(message.NOMBRE_REQUERIDO)        
        })  
      })        
})