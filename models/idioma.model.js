const mongoose = require('mongoose')
const message  = require('../utils/message')

const idiomaSchema = new mongoose.Schema(
{
    nombre: {
        type: String,
        required: [true, message.NOMBRE_REQUERIDO],
        unique: true,
        trim: true        
      }
    }  
)

const Idioma = mongoose.model('Idioma', idiomaSchema, 'idiomas')

module.exports = Idioma