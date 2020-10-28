const mongoose = require('mongoose')
const message  = require('../utils/message')

const libroSchema = new mongoose.Schema(
{
	titulo: {
    type: String,
    required: [true, message.TITULO_REQUERIDO],
    trim: true
  },

  observaciones: String, 

  tema: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tema',
    required: [true, message.TEMA_REQUERIDO]
  },

  editorial: {
    type: mongoose.Schema.ObjectId,
    ref: 'Editorial',
    required: [true, message.EDITORIAL_REQUERIDA]
  },

  idioma: {
    type: mongoose.Schema.ObjectId,
    ref: 'Idioma',  
    required: [true, message.IDIOMA_REQUERIDO]
  },

  paginas: {
    type: Number,
    required: [true, message.PAGINAS_REQUERIDO],
    min: [1, message.PAGINAS_MINIMO]
  },

  publicado: {
    type: Number,
    required: [true, message.PUBLICADO_REQUERIDO],
    min: [2005, message.PUBLICADO_LIBRO_MINIMO]
  },

  created_at: {
    type: Date,
    default: Date.now(),
    select: false
  }
})

const Libro = mongoose.model('Libro', libroSchema, 'libros')

module.exports = Libro