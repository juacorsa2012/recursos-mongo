const request  = require('supertest')
const mongoose = require('mongoose')
const statusCode = require('http-status-codes')
const Tema   = require('../../models/tema.model')
const Idioma = require('../../models/idioma.model')
const Fabricante  = require('../../models/fabricante.model')
const Tutorial    = require('../../models/tutorial.model')
const message     = require('../../utils/message')
const {clearDB}   = require('../utils')
const {añoActual} = require('../../utils/helpers')

const app = require('../../app')
const url = "/api/v1/tutoriales/"

describe('/api/v1/tutoriales', () => {
    describe('GET /', () => { 
        let fabricante
        let idioma
        let tema

        beforeAll(async () => {          
          await clearDB()
          fabricante = await Fabricante.create({ nombre: 'Fabricante 1'})  
          idioma = await Idioma.create({ nombre: 'Idioma 1'})  
          tema   = await Tema.create({ nombre: 'Tema 1'})  

          const tutorial = {
            "titulo"    : "Titulo tutorial",
            "duracion"  : 166,
            "publicado" : añoActual(),
            "tema"      : tema._id,
            "fabricante": fabricante._id,
            "idioma"    : idioma._id
          }

          await Tutorial.create(tutorial)
        })

        it("debe devolver todos los tutoriales", async () => {        
            const res = await request(app).get(url)
              
            expect(res.statusCode).toBe(statusCode.OK)
            expect(res.body.status).toBe(message.SUCCESS)
            expect(res.body.results).toBeDefined()            
            expect(res.body.results).toBe(1)                    
        })  
  
        it("debe devolver el total de tutoriales registrados", async () => {    
            const res = await request(app).get(url + 'contar')
  
            expect(res.statusCode).toBe(statusCode.OK)
            expect(res.body.status).toBe(message.SUCCESS)           
            expect(res.body.data.count).toBe(1)
        })         
    })

    describe('GET /:id', () => {
        let fabricante
        let idioma
        let tema
        let tutorial
  
        beforeAll(async () => {          
          await clearDB()
          fabricante = await Fabricante.create({ nombre: 'Fabricante 1'})  
          idioma = await Idioma.create({ nombre: 'Idioma 1'})  
          tema   = await Tema.create({ nombre: 'Tema 1'})  
  
          const datos = {
            "titulo"    : "Titulo tutorial",
            "duracion"  : 100,
            "publicado" : añoActual(),
            "tema"      : tema._id,
            "fabricante": fabricante._id,
            "idioma"    : idioma._id
          }
  
          tutorial = await Tutorial.create(datos)
        })
  
        it("debe devolver un tutorial", async() => {
          const res = await request(app).get(url + tutorial._id)
  
          expect(res.statusCode).toBe(statusCode.OK)
          expect(res.body.status).toBe(message.SUCCESS)           
          expect(res.body.data.tutorial.titulo).toBe(tutorial.titulo)
          expect(res.body.data.tutorial._id).toBeDefined()         
        })
    
        it("debe devolver un error 404 si el id está mal formado", async() => {
          const id = mongoose.Types.ObjectId()
          const res = await request(app).get(url + id)
  
          expect(res.statusCode).toBe(statusCode.NOT_FOUND)
        })
  
        it("debe devolver un error 400 si el tutorial no existe", async() => {
          const res = await request(app).get(url + '1')
  
          expect(res.statusCode).toBe(statusCode.BAD_REQUEST)    
        })      
      })

    describe('POST /', () => {   
        let fabricante
        let idioma
        let tema
        let tutorial

        beforeEach(async () => {
            await clearDB()        
            fabricante = await Fabricante.create({ nombre: 'Fabricante 1'})  
            idioma = await Idioma.create({ nombre: 'Idioma 1'})  
            tema   = await Tema.create({ nombre: 'Tema 1'})  
            tutorial = {
                "titulo"    : "Titulo tutorial",
                "duracion"  : 166,
                "publicado" : añoActual(),
                "tema"      : tema._id,
                "fabricante": fabricante._id,
                "idioma"    : idioma._id
              }
        })
    
        it("debe registrar un tutorial", async () => {    
            const res = await request(app).post(url).send(tutorial)
    
            expect(res.statusCode).toBe(statusCode.CREATED)
            expect(res.body.status).toBe(message.SUCCESS)
            expect(res.body.message).toBe(message.TUTORIAL_REGISTRADO)
            expect(res.body.data.tutorial.titulo).toBe(tutorial.titulo)   
            expect(res.body.data.tutorial._id).toBeDefined()        
        })

        it("debe devolver un error 400 cuando no se facilita el título del tutorial", async () => {
            tutorial.titulo = ''

            const res = await request(app).post(url).send(tutorial)
    
            expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
            expect(res.body.success).toBeFalsy()
            expect(res.body.error).toBe(message.TITULO_REQUERIDO)        
        })
    
        it("debe devolver un error 400 cuando no se facilita el tema del tutorial", async () => {
            delete tutorial.tema

            const res = await request(app).post(url).send(tutorial)
    
            expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
            expect(res.body.success).toBeFalsy()
            expect(res.body.error).toBe(message.TEMA_REQUERIDO)     
        })
    
        it("debe devolver un error 400 cuando no se facilita el idioma del tutorial", async () => {
            delete tutorial.idioma

            const res = await request(app).post(url).send(tutorial)
    
            expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
            expect(res.body.success).toBeFalsy()
            expect(res.body.error).toBe(message.IDIOMA_REQUERIDO)
        })
    
        it("debe devolver un error 400 cuando no se facilita el fabricante del tutorial", async () => {
            delete tutorial.fabricante

            const res = await request(app).post(url).send(tutorial)
    
            expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
            expect(res.body.success).toBeFalsy()
            expect(res.body.error).toBe(message.FABRICANTE_REQUERIDO)
        })

        it("debe devolver un error 400 cuando no se facilita la duración del tutorial", async () => {
            delete tutorial.duracion

            const res = await request(app).post(url).send(tutorial)
    
            expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
            expect(res.body.success).toBeFalsy()
            expect(res.body.error).toBe(message.DURACION_REQUERIDA)
        })

        it("debe devolver un error 400 cuando la duración del tutorial no es correcta", async () => {
            tutorial.duracion = 0

            const res = await request(app).post(url).send(tutorial)
    
            expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
            expect(res.body.success).toBeFalsy()
            expect(res.body.error).toBe(message.DURACION_MINIMA)
        })
    
        it("debe devolver un error 400 cuando el año de publicación del tutorial no es correcta", async () => {
            tutorial.publicado = añoActual() + 1 

            const res = await request(app).post(url).send(tutorial)
    
            expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
            expect(res.body.success).toBeFalsy()
            expect(res.body.error).toBe(message.PUBLICADO_MAXIMO)
        })
    })

    describe('PUT /', () => {   
        let fabricante
        let idioma
        let tema
        let tutorial

        beforeEach(async () => {
            await clearDB()        
            fabricante = await Fabricante.create({ nombre: 'Fabricante 1'})  
            idioma = await Idioma.create({ nombre: 'Idioma 1'})  
            tema   = await Tema.create({ nombre: 'Tema 1'})  
            datos = {
              "titulo"    : "Titulo libro",
              "duracion"  : 166,
              "publicado" : añoActual(),
              "tema"      : tema._id,
              "fabricante": fabricante._id,
              "idioma"    : idioma._id
            }
      
            tutorial = await Tutorial.create(datos)
        })

        it("debe actualizar un tutorial", async () => {
            datos.titulo = datos.titulo + ' actualizado'      
      
            const res = await request(app).put(url + tutorial._id).send(datos)
      
            expect(res.statusCode).toBe(statusCode.OK)
            expect(res.body.status).toBe(message.SUCCESS)
            expect(res.body.message).toBe(message.TUTORIAL_ACTUALIZADO)
            expect(res.body.data.tutorial.titulo).toBe(datos.titulo)   
            expect(res.body.data.tutorial._id).toBeDefined()        
        })

        it("debe devolver un error 400 si el año de publicación es posterior al año en curso", async () => {
            datos.publicado = añoActual() + 1
      
            const res = await request(app).put(url + tutorial._id).send(datos)      
      
            expect(res.statusCode).toBe(statusCode.BAD_REQUEST)
            expect(res.body.error).toBe(message.PUBLICADO_MAXIMO)
        })
      
        it("debe devolver un error 400 si el tema del tutorial no existe", async () => {
            datos.tema = mongoose.Types.ObjectId()     
      
            const res = await request(app).put(url + tutorial._id).send(datos)      
      
            expect(res.statusCode).toBe(statusCode.BAD_REQUEST)
            expect(res.body.error).toBe(message.TEMA_NO_ENCONTRADO)
        })
      
        it("debe devolver un error 400 si el idioma del tutorial no existe", async () => {
            datos.idioma = mongoose.Types.ObjectId()     
      
            const res = await request(app).put(url + tutorial._id).send(datos)      
      
            expect(res.statusCode).toBe(statusCode.BAD_REQUEST)
            expect(res.body.error).toBe(message.IDIOMA_NO_ENCONTRADO)
        })
        
        it("debe devolver un error 400 si el fabricante del tutorial no existe", async () => {
            datos.fabricante = mongoose.Types.ObjectId()     
      
            const res = await request(app).put(url + tutorial._id).send(datos)      
      
            expect(res.statusCode).toBe(statusCode.BAD_REQUEST)
            expect(res.body.error).toBe(message.FABRICANTE_NO_ENCONTRADO)
        })

        it("debe devolver un error 400 si el tutorial no existe", async () => {
            const id = mongoose.Types.ObjectId()     
      
            const res = await request(app).put(url + id).send(datos)      
      
            expect(res.statusCode).toBe(statusCode.NOT_FOUND)
            expect(res.body.error).toBe(message.TUTORIAL_NO_ENCONTRADO)
        })
      
        it("debe devolver un error 400 si no se facilita el título del tutorial", async () => {
            datos.titulo = ''
      
            const res = await request(app).put(url + tutorial._id).send(datos)      
            
            expect(res.statusCode).toBe(statusCode.BAD_REQUEST)
            expect(res.body.error).toBe(message.TITULO_REQUERIDO)
        })

        it("debe devolver un error 400 si no se facilita el año de publicación del tutorial", async () => {
            datos.publicado = ''
      
            const res = await request(app).put(url + tutorial._id).send(datos)      
            
            expect(res.statusCode).toBe(statusCode.BAD_REQUEST)
            expect(res.body.error).toBe(message.PUBLICADO_REQUERIDO)
        })

        it("debe devolver un error 400 si no se facilita el año de publicación del tutorial", async () => {
            datos.publicado = añoActual() + 1
      
            const res = await request(app).put(url + tutorial._id).send(datos)      
            
            expect(res.statusCode).toBe(statusCode.BAD_REQUEST)
            expect(res.body.error).toBe(message.PUBLICADO_MAXIMO)
        })

        it("debe devolver un error 400 si no se facilita la duración del tutorial", async () => {
            datos.duracion = ''
      
            const res = await request(app).put(url + tutorial._id).send(datos)      
            
            expect(res.statusCode).toBe(statusCode.BAD_REQUEST)
            expect(res.body.error).toBe(message.DURACION_REQUERIDA)
        })

        it("debe devolver un error 400 si la duración del tutorial es 0", async () => {
            datos.duracion = 0
      
            const res = await request(app).put(url + tutorial._id).send(datos)      
            
            expect(res.statusCode).toBe(statusCode.BAD_REQUEST)
            expect(res.body.error).toBe(message.DURACION_MINIMA)
        })

        it("debe devolver un error 400 si la duración del tutorial es inferior a 0", async () => {
            datos.duracion = -10
      
            const res = await request(app).put(url + tutorial._id).send(datos)      
            
            expect(res.statusCode).toBe(statusCode.BAD_REQUEST)
            expect(res.body.error).toBe(message.DURACION_MINIMA)
        })
    })
})