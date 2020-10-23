const mongoose = require('mongoose')
const message  = require('../utils/message')

const fabricanteSchema = new mongoose.Schema(
{
    nombre: {
        type: String,
        required: [true, message.NOMBRE_REQUERIDO],
        unique: true,
        trim: true        
      }
    }  
)

const Fabricante = mongoose.model('Fabricante', fabricanteSchema, 'fabricantes')

module.exports = Fabricante