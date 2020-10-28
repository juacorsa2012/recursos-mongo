const request = require('supertest')
const statusCode = require('http-status-codes')
const Editorial  = require('../../models/editorial.model')
const Tema   = require('../../models/tema.model')
const Idioma = require('../../models/idioma.model')
const Libro  = require('../../models/libro.model')
const message   = require('../../utils/message')
const {clearDB} = require('../utils')

const app = require('../../app')

const url = "/api/v1/libros/"

describe('/api/v1/libros', () => {
    describe('GET /', () => {
        let editorial
        let idioma
        let tema

        beforeAll(async () => {          
          await clearDB()
          editorial = await Editorial.create({ nombre: 'Editorial 1'})  
          idioma = await Idioma.create({ nombre: 'Idioma 1'})  
          tema   = await Tema.create({ nombre: 'Tema 1'})  

          const libro = {
            "titulo"   : "Titulo libro",
            "paginas"  : 1,
            "publicado": 2019,
            "tema"     : tema._id,
            "editorial": editorial._id,
            "idioma"   : idioma._id
          }

          await Libro.create(libro)
        })
  
        it("debe devolver todos los libros", async () => {        
          const res = await request(app).get(url)
            
          expect(res.statusCode).toBe(statusCode.OK)
          expect(res.body.status).toBe(message.SUCCESS)
          expect(res.body.results).toBeDefined()            
          expect(res.body.results).toBe(1)                    
        })  
        
        it("debe devolver el total de libros registrados", async () => {    
          const res = await request(app).get(url + 'contar')

          expect(res.statusCode).toBe(statusCode.OK)
          expect(res.body.status).toBe(message.SUCCESS)           
          expect(res.body.data.count).toBe(1)
        })
    })

    describe('POST /', () => {   
      let editorial
      let idioma
      let tema

      beforeAll(async () => {
        await clearDB()        
        editorial = await Editorial.create({ nombre: 'Editorial 1'})  
        idioma = await Idioma.create({ nombre: 'Idioma 1'})  
        tema   = await Tema.create({ nombre: 'Tema 1'})  
      })

      it("debe registrar un libro", async () => {
        const libro = {
          "titulo"   : "Titulo libro",
          "paginas"  : 1,
          "publicado": 2019,
          "tema"     : tema._id,
          "editorial": editorial._id,
          "idioma"   : idioma._id
        }

        const res = await request(app).post(url).send(libro)

        expect(res.statusCode).toBe(statusCode.CREATED)
        expect(res.body.status).toBe(message.SUCCESS)
        expect(res.body.message).toBe(message.LIBRO_REGISTRADO)
        expect(res.body.data.libro.titulo).toBe(libro.titulo)   
        expect(res.body.data.libro._id).toBeDefined()        
      })

      it("debe devolver un error 400 cuando no se facilita el título del libro", async () => {
        const libro = {
          "titulo"   : "",
          "paginas"  : 1,
          "publicado": 2019,
          "tema"     : tema._id,
          "editorial": editorial._id,
          "idioma"   : idioma._id
        }        

        const res = await request(app).post(url).send(libro)

        expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
        expect(res.body.success).toBeFalsy()
        expect(res.body.error).toBe(message.TITULO_REQUERIDO)        
      })

      it("debe devolver un error 400 cuando no se facilita el número de páginas del libro", async () => {
        const libro = {
          "titulo"   : "título 1",          
          "publicado": 2019,
          "tema"     : tema._id,
          "editorial": editorial._id,
          "idioma"   : idioma._id
        }        

        const res = await request(app).post(url).send(libro)

        expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
        expect(res.body.success).toBeFalsy()
        expect(res.body.error).toBe(message.PAGINAS_REQUERIDO)
      })

      it("debe devolver un error 400 cuando el número de páginas del libro es inferior a uno", async () => {
        const libro = {
          "titulo"   : "título 1",  
          "paginas"  : 0,
          "publicado": 2019,
          "tema"     : tema._id,
          "editorial": editorial._id,
          "idioma"   : idioma._id
        }        

        const res = await request(app).post(url).send(libro)

        expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
        expect(res.body.success).toBeFalsy()
        expect(res.body.error).toBe(message.PAGINAS_MINIMO)
      })

      it("debe devolver un error 400 cuando el año de publicación es anterior a 2005", async () => {
        const libro = {
          "titulo"   : "título 1",  
          "paginas"  : 23,
          "publicado": 2004,
          "tema"     : tema._id,
          "editorial": editorial._id,
          "idioma"   : idioma._id
        }        

        const res = await request(app).post(url).send(libro)

        expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
        expect(res.body.success).toBeFalsy()
        expect(res.body.error).toBe(message.PUBLICADO_LIBRO_MINIMO)
      })

      it("debe devolver un error 400 cuando no se facilita el año de publicación", async () => {
        const libro = {
          "titulo"   : "título 1",  
          "paginas"  : 23,
          "tema"     : tema._id,
          "editorial": editorial._id,
          "idioma"   : idioma._id
        }        

        const res = await request(app).post(url).send(libro)

        expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
        expect(res.body.success).toBeFalsy()
        expect(res.body.error).toBe(message.PUBLICADO_REQUERIDO)
      })

      it("debe devolver un error 400 cuando no se facilita el idioma del libro", async () => {
        const libro = {
          "titulo"   : "título 1",  
          "paginas"  : 23,
          "publicado": 2020,
          "tema"     : tema._id,
          "editorial": editorial._id          
        }        

        const res = await request(app).post(url).send(libro)

        expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
        expect(res.body.success).toBeFalsy()
        expect(res.body.error).toBe(message.IDIOMA_REQUERIDO)
      })

      it("debe devolver un error 400 cuando no se facilita el tema del libro", async () => {
        const libro = {
          "titulo"   : "título 1",  
          "paginas"  : 23,
          "publicado": 2020,
          "idioma"   : idioma._id,
          "editorial": editorial._id          
        }        

        const res = await request(app).post(url).send(libro)

        expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
        expect(res.body.success).toBeFalsy()
        expect(res.body.error).toBe(message.TEMA_REQUERIDO)
      })

      it("debe devolver un error 400 cuando no se facilita la editorial del libro", async () => {
        const libro = {
          "titulo"   : "título 1",  
          "paginas"  : 23,
          "publicado": 2020,
          "idioma"   : idioma._id,
          "tema"     : tema._id
        }        

        const res = await request(app).post(url).send(libro)

        expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
        expect(res.body.success).toBeFalsy()
        expect(res.body.error).toBe(message.EDITORIAL_REQUERIDA)
      })
    })


})