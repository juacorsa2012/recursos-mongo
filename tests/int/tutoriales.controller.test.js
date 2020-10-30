const request = require('supertest')
const statusCode = require('http-status-codes')
const Editorial  = require('../../models/editorial.model')
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


})