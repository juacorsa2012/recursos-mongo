require('dotenv').config({ path: '../config/.env' })
const mongoose = require('mongoose')
const argv   = require('minimist')(process.argv.slice(2))
const randomYear = require('random-year')
const faker = require('faker')
const Tema   = require('../models/tema.model')
const Idioma = require('../models/idioma.model')
const Fabricante = require('../models/fabricante.model')
const Editorial  = require('../models/editorial.model')
const Libro      = require('../models/libro.model')
const Tutorial   = require('../models/tutorial.model')

const {añoActual} = require('../utils/helpers')

const database  = process.env.DATABASE
const options   = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true }
const añoMinimo = 2005
const añoMaximo = añoActual()

const seedTemas = async (docs) => {
    try {
        console.log(`Registrando ${docs} temas ...`)
        await Tema.deleteMany()
    
        for (let i = 0; i < docs; i++) {                      
            const tema = { nombre : "Tema " + i }                
        	await Tema.create(tema)
    	    let progreso = Math.ceil((i/docs)*100) + '%'
    	    process.stdout.write('Progreso: ' + progreso + '\r')
        }

        console.log('Proceso finalizado!!')
        process.exit()
    } catch(err) {
        console.log(err)
    }
}

const seedIdiomas = async (docs) => {
    try {
        console.log(`Registrando ${docs} idiomas ...`)
        await Idioma.deleteMany()
    
        for (let i = 0; i < docs; i++) {                      
            const idioma = { nombre : "Idioma " + i }                
        	await Idioma.create(idioma)
    	    let progreso = Math.ceil((i/docs)*100) + '%'
    	    process.stdout.write('Progreso: ' + progreso + '\r')
        }

        console.log('Proceso finalizado!!')
        process.exit()
    } catch(err) {
        console.log(err)
    }
}

const seedFabricantes = async (docs) => {
    try {
        console.log(`Registrando ${docs} fabricantes ...`)
        await Fabricante.deleteMany()
    
        for (let i = 0; i < docs; i++) {                      
            const fabricante = { nombre : "Fabricante " + i }                
        	await Fabricante.create(fabricante)
    	    let progreso = Math.ceil((i/docs)*100) + '%'
    	    process.stdout.write('Progreso: ' + progreso + '\r')
        }

        console.log('Proceso finalizado!!')
        process.exit()
    } catch(err) {
        console.log(err)
    }
}

const seedEditoriales = async (docs) => {
    try {
        console.log(`Registrando ${docs} editoriales ...`)
        await Editorial.deleteMany()
    
        for (let i = 0; i < docs; i++) {                      
            const editorial = { nombre : "Editorial " + i }                
        	await Editorial.create(editorial)
    	    let progreso = Math.ceil((i/docs)*100) + '%'
    	    process.stdout.write('Progreso: ' + progreso + '\r')
        }

        console.log('Proceso finalizado!!')
        process.exit()
    } catch(err) {
        console.log(err)
    }
}

const seedLibros = async (docs) => {
    try {
        console.log(`Registrando ${docs} libros ...`)
        await Libro.deleteMany()
        const nTemas = await Tema.countDocuments()
        const nIdiomas = await Idioma.countDocuments()
        const nEditoriales = await Editorial.countDocuments()
    
        for (let i = 0; i < docs; i++) {
            let r = Math.floor(Math.random() * nTemas)
            const tema = await Tema.find().select('_id').limit(1).skip(r);		   
  
            r = Math.floor(Math.random() * nIdiomas);
            const idioma = await Idioma.find().select('_id').limit(1).skip(r);        
  
            r = Math.floor(Math.random() * nEditoriales);
            const editorial = await Editorial.find().select('_id').limit(1).skip(r);            	

            const libro = {
                titulo   : faker.lorem.sentence(),
                tema     : tema[0]._id,
                idioma   : idioma[0]._id,
                editorial: editorial[0]._id,
                observaciones: faker.lorem.text(),
                paginas   : 1 + faker.random.number(),
                publicado : randomYear({ min: añoMinimo, max: añoMaximo })
            }     

        	await Libro.create(libro)    	
    	    let progreso = Math.ceil((i/docs)*100) + '%';
    	    process.stdout.write('Progreso: ' + progreso + '\r');    
        }

        console.log('Proceso finalizado!!');
        process.exit();
    } catch(err) {
        console.log(err)
    }
}

const seedTutoriales = async (docs) => {
    try {
        console.log(`Registrando ${docs} tutoriales ...`)
        await Tutorial.deleteMany()
        const nTemas = await Tema.countDocuments()
        const nIdiomas = await Idioma.countDocuments()
        const nFabricantes = await Fabricante.countDocuments()
    
        for (let i = 0; i < docs; i++) {
            let r = Math.floor(Math.random() * nTemas)
            const tema = await Tema.find().select('_id').limit(1).skip(r)
  
            r = Math.floor(Math.random() * nIdiomas)
            const idioma = await Idioma.find().select('_id').limit(1).skip(r)
  
            r = Math.floor(Math.random() * nFabricantes)
            const fabricante = await Fabricante.find().select('_id').limit(1).skip(r)

            const tutorial = {
                titulo : faker.lorem.sentence(),
                tema   : tema[0]._id,
                idioma : idioma[0]._id,
                fabricante : fabricante[0]._id,
                observaciones : faker.lorem.text(),
                duracion  : faker.random.number(),
                publicado : randomYear({ min: añoMinimo, max: añoMaximo })
            }     

        	await Tutorial.create(tutorial)    	
    	    let progreso = Math.ceil((i/docs)*100) + '%'
    	    process.stdout.write('Progreso: ' + progreso + '\r')
        }

        console.log('Proceso finalizado!!')
        process.exit()
    } catch(err) {
        console.log(err)
    }
}

mongoose.connect(database, options)

const n = argv['n']
const resource = argv['r']

//node seed.js -n 10 -r temas

switch(resource) {
    case 'temas':
        seedTemas(n)
        break
    case 'idiomas':
        seedIdiomas(n)
        break
    case 'fabricantes':
        seedFabricantes(n)
        break      
    case 'editoriales':
        seedEditoriales(n)
        break      
    
    case 'libros':
        seedLibros(n)
        break      
    case 'tutoriales':
        seedTutoriales(n)
        break      
    default:
        console.log('Oopss!!. La opción indicada no es correcta!')
        process.exit()
}