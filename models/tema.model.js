const mongoose = require('mongoose')
const message  = require('../utils/message')

const temaSchema = new mongoose.Schema(
{
    nombre: {
        type: String,
        required: [true, message.NOMBRE_REQUERIDO],
        unique: true,
        trim: true        
      }
    }  
)

const Tema = mongoose.model('Tema', temaSchema, 'temas')

module.exports = Tema