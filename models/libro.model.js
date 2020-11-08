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

libroSchema.statics.obtenerLibrosTotales = function() {
  return this.aggregate([   
    {"$group"   : { _id: null, sum: { $sum: 1 } } },
    {"$project" : { _id: 0 } }
  ])
}

libroSchema.statics.obtenerPaginasTotales = function() {
  return this.aggregate([   
    {"$group"   : { _id: null, sum: { $sum: "$paginas" } } },
    {"$project" : { _id: 0 } }
  ])
}

libroSchema.statics.obtenerLibrosPorTema = function() {
  return this.aggregate([
    { $lookup: { from : "temas", localField : "tema", foreignField : "_id", as : "tema" } },  
    { $unwind  : "$tema" },    
    { $group   : { "_id" : null, "count" : { "$sum" :1 }, "data" : { "$push":"$$ROOT"}}},       
    { $unwind  : "$data" },        
    { $group   : { "_id" : "$data.tema.nombre", "count" : { "$sum" : 1 }, "total" :{ "$first" : "$count" } } },
    { $sort    : { "count" : -1 } },    
    { $project : { "_id" : 0, "tema" : "$_id", "count" : 1, "peso" : {"$multiply":[{"$divide":[100,"$total"]},"$count"]}}}    
  ])
}

libroSchema.statics.obtenerLibrosPorPublicado = function() {
  return this.aggregate([
    { $group   : {"_id" : null, "count" : { "$sum" : 1 }, "data" : { "$push":"$$ROOT"}}},       
    { $unwind  : "$data" },        
    { $group   : {"_id": "$data.publicado", "count" : {"$sum":1}, "total":{"$first":"$count"}}},
    { $sort    : { "count" : -1 } },    
    { $project : { "_id" : 0, "publicado" : "$_id", "count" : 1, "peso" : {"$multiply":[{"$divide":[100,"$total"]},"$count"]}}}    
  ])
}

libroSchema.statics.obtenerLibrosPorEditorial = function() {
  return this.aggregate([
    { $lookup: { from: "editoriales", localField: "editorial", foreignField: "_id", as: "editorial" } },  
    { $unwind  : "$editorial" },    
    { $group   : {"_id" : null, "count" : { "$sum" : 1 }, "data" : { "$push":"$$ROOT"}}},       
    { $unwind  : "$data" },        
    { $group   : {"_id": "$data.editorial.nombre", "count" : {"$sum":1}, "total":{"$first":"$count"}}},
    { $sort    : { "count" : -1 } },    
    { $project : { "_id" : 0, "editorial" : "$_id", "count" : 1, "peso": {"$multiply":[{"$divide":[100,"$total"]},"$count"]}}}    
  ])
}

libroSchema.statics.obtenerLibrosPorIdioma = function() {
  return this.aggregate([
    { $lookup: { from: "idiomas", localField: "idioma", foreignField: "_id", as: "idioma" } },  
    { $unwind  : "$idioma" },    
    { $group   : {"_id" : null, "count" : { "$sum" : 1 }, "data" : { "$push":"$$ROOT"}}},       
    { $unwind  : "$data" },        
    { $group   : {"_id": "$data.idioma.nombre", "count" : { "$sum" : 1 }, "total":{"$first":"$count"}}},
    { $sort    : { "count" : -1 } },       
    { $project : { "_id" : 0, "idioma" : "$_id", "count" : 1, "peso": {"$multiply":[{"$divide":[100,"$total"]},"$count"]}}}    
  ])
}

libroSchema.statics.obtenerLibrosPorTemaPublicado = function() {
  return this.aggregate([
    { $lookup: { from : "temas", localField : "tema", foreignField : "_id", as : "tema" } },  
    { $unwind  : "$tema" },    
    { $group   : {"_id" : null, "count" : { "$sum" : 1 }, "data" : { "$push" : "$$ROOT"} } },       
    { $unwind  : "$data" },        
    { $group   : {"_id": { tema : "$data.tema.nombre", publicado : "$data.publicado" }, "count" : {"$sum":1}, "total":{"$first":"$count"}}},
    { $sort    : { "count" : -1 } },       
    { $project : { "_id" : 0, "tema" : "$_id.tema", "publicado" : "$_id.publicado", count : 1, peso : {"$multiply":[{"$divide":[100,"$total"]},"$count"]}}}      
  ])
}

libroSchema.statics.obtenerLibrosPorEditorialPublicado = function() {
  return this.aggregate([
    { $lookup: { from: "editoriales", localField: "editorial", foreignField: "_id", as: "editorial" } },      
    { $unwind  : "$editorial" },    
    { $group   : {"_id" : null, "count" : { "$sum" : 1 }, "data" : { "$push":"$$ROOT"}}},       
    { $unwind  : "$data"},        
    { $group   : {"_id": { editorial : "$data.editorial.nombre", publicado : "$data.publicado" }, "count" : {"$sum":1}, "total":{"$first":"$count"}}},
    { $sort    : { "count" : -1 } },      
    { $project : { "_id" : 0, "editorial" : "$_id.editorial", "publicado" : "$_id.publicado", "count" : 1, "peso": {"$multiply":[{"$divide":[100,"$total"]},"$count"]}}}      
  ])
}

const Libro = mongoose.model('Libro', libroSchema, 'libros')

module.exports = Libro