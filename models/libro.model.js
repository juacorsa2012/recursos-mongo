const mongoose = require('mongoose')

const libroSchema = new mongoose.Schema(
{
	titulo: {
    type: String,
    required: [true, 'El título del libro es un dato requerido'],      
    trim: true
  },

  observaciones: String, 

  tema: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tema',
    required: [true, 'El tema del libro es un dato requerido']
  },

  editorial: {
    type: mongoose.Schema.ObjectId,
    ref: 'Editorial',
    required: [true, 'La editorial del libro es un dato requerido']
  },

  idioma: {
    type: mongoose.Schema.ObjectId,
    ref: 'Idioma',
    required: [true, 'El idioma del libro es un dato requerido']
  },

  paginas: {
    type: Number,
    required: [true, 'El número de páginas es un dato requerido'],
    min: [1, 'El número de páginas debe ser como mínimo de una']
  },

  publicado: {
    type: Number,
    required: [true, 'El año de publicación es un dato requerido'],
    min: [2010, 'El año de publicación no puede ser anterior a 2010']
  },

  created_at: {
    type: Date,
    default: Date.now(),
    select: false
  }
})

const Libro = mongoose.model('Libro', libroSchema, 'libros')

module.exports = Libro