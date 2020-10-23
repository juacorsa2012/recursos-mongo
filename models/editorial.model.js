const mongoose = require('mongoose')
const message  = require('../utils/message')

const editorialSchema = new mongoose.Schema(
{
    nombre: {
        type: String,
        required: [true, message.NOMBRE_REQUERIDO],
        unique: true,
        trim: true        
      }
    }  
)

const Editorial = mongoose.model('Editorial', editorialSchema, 'editoriales')

module.exports = Editorial