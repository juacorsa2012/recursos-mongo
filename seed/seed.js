require('dotenv').config({ path: '../config/.env' });
const faker = require('faker')
const mongoose = require('mongoose')
const argv   = require('minimist')(process.argv.slice(2))
const Tema   = require('../models/tema.model')
const Idioma = require('../models/idioma.model')
const Fabricante = require('../models/fabricante.model')
const Editorial  = require('../models/editorial.model')

const database = process.env.DATABASE
const options  = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true }

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

}

const seedTutoriales = async (docs) => {

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