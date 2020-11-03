const request = require('supertest')
const mongoose = require('mongoose')
const statusCode = require('http-status-codes')
const Editorial  = require('../../models/editorial.model')
const Tema   = require('../../models/tema.model')
const Idioma = require('../../models/idioma.model')
const Libro  = require('../../models/libro.model')
const message   = require('../../utils/message')
const {clearDB} = require('../utils')
const {añoActual} = require('../../utils/helpers')

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
      let libro

      beforeEach(async () => {
        await clearDB()        
        editorial = await Editorial.create({ nombre: 'Editorial 1'})  
        idioma = await Idioma.create({ nombre: 'Idioma 1'})  
        tema   = await Tema.create({ nombre: 'Tema 1'})  
        libro = {
          "titulo"    : "Titulo libro",
          "paginas"   : 166,
          "publicado" : añoActual(),
          "tema"      : tema._id,
          "editorial" : editorial._id,
          "idioma"    : idioma._id
        }
      })

      it("debe registrar un libro", async () => {
        const res = await request(app).post(url).send(libro)

        expect(res.statusCode).toBe(statusCode.CREATED)
        expect(res.body.status).toBe(message.SUCCESS)
        expect(res.body.message).toBe(message.LIBRO_REGISTRADO)
        expect(res.body.data.libro.titulo).toBe(libro.titulo)   
        expect(res.body.data.libro._id).toBeDefined()        
      })

      it("debe devolver un error 400 cuando no se facilita el título del libro", async () => {
        libro.titulo = ''

        const res = await request(app).post(url).send(libro)

        expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
        expect(res.body.success).toBeFalsy()
        expect(res.body.error).toBe(message.TITULO_REQUERIDO)        
      })

      it("debe devolver un error 400 cuando no se facilita el número de páginas del libro", async () => {
        delete libro.paginas

        const res = await request(app).post(url).send(libro)

        expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
        expect(res.body.success).toBeFalsy()
        expect(res.body.error).toBe(message.PAGINAS_REQUERIDO)
      })

      it("debe devolver un error 400 cuando el número de páginas del libro es inferior a uno", async () => {
        libro.paginas = 0
        const res = await request(app).post(url).send(libro)

        expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
        expect(res.body.success).toBeFalsy()
        expect(res.body.error).toBe(message.PAGINAS_MINIMO)
      })

      it("debe devolver un error 400 cuando el año de publicación es anterior a 2005", async () => {
        libro.publicado = 2004

        const res = await request(app).post(url).send(libro)

        expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
        expect(res.body.success).toBeFalsy()
        expect(res.body.error).toBe(message.PUBLICADO_LIBRO_MINIMO)
      })

      it("debe devolver un error 400 cuando no se facilita el año de publicación", async () => {
        delete libro.publicado

        const res = await request(app).post(url).send(libro)

        expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
        expect(res.body.success).toBeFalsy()
        expect(res.body.error).toBe(message.PUBLICADO_REQUERIDO)
      })

      it("debe devolver un error 400 cuando no se facilita el idioma del libro", async () => {
        delete libro.idioma

        const res = await request(app).post(url).send(libro)

        expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
        expect(res.body.success).toBeFalsy()
        expect(res.body.error).toBe(message.IDIOMA_REQUERIDO)
      })

      it("debe devolver un error 400 cuando no se facilita el tema del libro", async () => {
        delete libro.tema
        
        const res = await request(app).post(url).send(libro)

        expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
        expect(res.body.success).toBeFalsy()
        expect(res.body.error).toBe(message.TEMA_REQUERIDO)
      })

      it("debe devolver un error 400 cuando no se facilita la editorial del libro", async () => {
        delete libro.editorial

        const res = await request(app).post(url).send(libro)

        expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
        expect(res.body.success).toBeFalsy()
        expect(res.body.error).toBe(message.EDITORIAL_REQUERIDA)
      })

      it("debe devolver un error 400 si el año de publicación es posterior al año en curso", async () => {
        libro.publicado = añoActual() + 1

        const res = await request(app).post(url).send(libro)

        expect(res.statusCode).toBe(statusCode.BAD_REQUEST)      
        expect(res.body.success).toBeFalsy()
        expect(res.body.error).toBe(message.PUBLICADO_MAXIMO)
      })

  })

  describe('PUT /', () => {   
    let editorial
    let idioma
    let tema
    let libro

    beforeEach(async () => {
      await clearDB()        
      editorial = await Editorial.create({ nombre: 'Editorial 1'})  
      idioma = await Idioma.create({ nombre: 'Idioma 1'})  
      tema   = await Tema.create({ nombre: 'Tema 1'})  
      datos = {
        "titulo"    : "Titulo libro",
        "paginas"   : 166,
        "publicado" : añoActual(),
        "tema"      : tema._id,
        "editorial" : editorial._id,
        "idioma"    : idioma._id
      }

      libro = await Libro.create(datos)
    })

    it("debe actualizar un libro", async () => {
      datos.titulo = datos.titulo + ' actualizado'      

      const res = await request(app).put(url + libro._id).send(datos)

      expect(res.statusCode).toBe(statusCode.OK)
      expect(res.body.status).toBe(message.SUCCESS)
      expect(res.body.message).toBe(message.LIBRO_ACTUALIZADO)
      expect(res.body.data.libro.titulo).toBe(datos.titulo)   
      expect(res.body.data.libro._id).toBeDefined()        
    })

    it("debe devolver un error 400 si el año de publicación es posterior al año en curso", async () => {
      datos.publicado = añoActual() + 1

      const res = await request(app).put(url + libro._id).send(datos)      

      expect(res.statusCode).toBe(statusCode.BAD_REQUEST)
      expect(res.body.error).toBe(message.PUBLICADO_MAXIMO)
    })

    it("debe devolver un error 400 si el tema del libro no existe", async () => {
      datos.tema = mongoose.Types.ObjectId()     

      const res = await request(app).put(url + libro._id).send(datos)      

      expect(res.statusCode).toBe(statusCode.BAD_REQUEST)
      expect(res.body.error).toBe(message.TEMA_NO_ENCONTRADO)
    })

    it("debe devolver un error 400 si el idioma del libro no existe", async () => {
      datos.idioma = mongoose.Types.ObjectId()     

      const res = await request(app).put(url + libro._id).send(datos)      

      expect(res.statusCode).toBe(statusCode.BAD_REQUEST)
      expect(res.body.error).toBe(message.IDIOMA_NO_ENCONTRADO)
    })

    it("debe devolver un error 400 si la editorial del libro no existe", async () => {
      datos.editorial = mongoose.Types.ObjectId()     

      const res = await request(app).put(url + libro._id).send(datos)      

      expect(res.statusCode).toBe(statusCode.BAD_REQUEST)
      expect(res.body.error).toBe(message.EDITORIAL_NO_ENCONTRADA)
    })

    it("debe devolver un error 400 si el libro no existe", async () => {
      const id = mongoose.Types.ObjectId()     

      const res = await request(app).put(url + id).send(datos)      

      expect(res.statusCode).toBe(statusCode.NOT_FOUND)
      expect(res.body.error).toBe(message.LIBRO_NO_ENCONTRADO)
    })

    it("debe devolver un error 400 si no se facilita el título del libro", async () => {
      datos.titulo = ''

      const res = await request(app).put(url + libro._id).send(datos)      
      
      expect(res.statusCode).toBe(statusCode.BAD_REQUEST)
      expect(res.body.error).toBe(message.TITULO_REQUERIDO)
    })



  })
})