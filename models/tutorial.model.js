const mongoose = require('mongoose')
const message  = require('../utils/message')

const tutorialSchema = new mongoose.Schema(
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

  fabricante: {
    type: mongoose.Schema.ObjectId,
    ref: 'Fabricante',
    required: [true, message.FABRICANTE_REQUERIDO]
  },

  idioma: {
    type: mongoose.Schema.ObjectId,
    ref: 'Idioma',
    required: [true, message.IDIOMA_REQUERIDO]
  },

  duracion: {
    type: Number,
    required: [true, message.DURACION_REQUERIDA],
    min: [1, message.DURACION_MINIMA]
  },

  publicado: {
    type: Number,
    required: [true, message.PUBLICADO_REQUERIDO],
    min: [2005, message.PUBLICADO_TUTORIAL_MINIMO]
  },

  created_at: {
    type: Date,
    default: Date.now(),
    select: false
  }
})

const Tutorial = mongoose.model('Tutorial', tutorialSchema, 'tutoriales')

module.exports = Tutorial