const Tema   = require('../models/tema.model')
const Idioma = require('../models/idioma.model')
const Fabricante = require('../models/fabricante.model')
const Editorial  = require('../models/editorial.model')
const Libro = require('../models/libro.model')

const clearDB = async () => {
    await Tema.deleteMany()
    await Fabricante.deleteMany()
    await Idioma.deleteMany()
    await Editorial.deleteMany()
    await Libro.deleteMany()
}

module.exports = {
    clearDB
}
