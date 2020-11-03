const statusCode = require('http-status-codes')
const Libro = require('../models/libro.model')
const Features = require('./../utils/Features')
const message = require('../utils/message')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const {añoActual} = require('../utils/helpers')
const Tema = require('../models/tema.model')
const Editorial = require('../models/editorial.model')
const Idioma = require('../models/idioma.model')

// @desc    Obtiene los libros registrados
// @route   GET /api/v1/libros
// @access  Public
const obtenerLibros = asyncHandler(async (req, res) => {    
    const features = new Features(Libro.find().populate('tema editorial idioma'), req.query)
      .filter()
      .sort()  
      .paginate()
  
    const libros = await features.query
    
    res.status(statusCode.OK).json({
      status : message.SUCCESS,
      results: libros.length,
      data   : { libros }
    })
})

// @desc    Obtiene un libro
// @route   GET /api/v1/libros/:id
// @access  Public
const obtenerLibro = asyncHandler(async (req, res, next) => {  
    const libro = await (await Libro.findById(req.params.id).populate('tema editorial idioma'))
    
    if (!libro) {     
      return next(new ErrorResponse(message.LIBRO_NO_ENCONTRADO, statusCode.NOT_FOUND))
    }   
         
    res.status(statusCode.OK).json({
      status: message.SUCCESS,
      data: { libro }
    })  
})

// @desc    Registra una nuevo libro
// @route   POST /api/v1/libros
// @access  Public
const registrarLibro = asyncHandler(async (req, res, next) => {    
    const { publicado } = req.body

    if (publicado > añoActual()) {
      return next(new ErrorResponse(message.PUBLICADO_MAXIMO, statusCode.BAD_REQUEST))
    }

    const libro = await Libro.create(req.body)  
      
    res.status(statusCode.CREATED).json({
      status : message.SUCCESS,
      message: message.LIBRO_REGISTRADO,
      data   : { libro }
    })        
})

// @desc    Actualiza un libro
// @route   PUT /api/v1/libros/:id
// @access  Public
const actualizarLibro = asyncHandler(async (req, res, next) => {  
  const { publicado, tema, idioma, editorial } = req.body

  if (publicado > añoActual()) {
    return next(new ErrorResponse(message.PUBLICADO_MAXIMO, statusCode.BAD_REQUEST))
  }
  
  if (!await Tema.findById(tema)) {    
    return next(new ErrorResponse(message.TEMA_NO_ENCONTRADO, statusCode.BAD_REQUEST))
  }  
  
  if (!await Idioma.findById(idioma)) {    
    return next(new ErrorResponse(message.IDIOMA_NO_ENCONTRADO, statusCode.BAD_REQUEST))
  }
  
  if (!await Editorial.findById(editorial)) {    
    return next(new ErrorResponse(message.EDITORIAL_NO_ENCONTRADA, statusCode.BAD_REQUEST))
  }

  const id = req.params.id   
  let libro = await Libro.findById(id)
  
  if (!libro) {
    return next(new ErrorResponse(message.LIBRO_NO_ENCONTRADO, statusCode.NOT_FOUND))
  }
      
  libro = await Libro.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  })  
            
  res.status(statusCode.OK).json({
    status: message.SUCCESS,
    message: message.LIBRO_ACTUALIZADO,
    data: { libro }
  })         
})

// @desc    Obtiene el número de libros registrados
// @route   GET /api/v1/libros/contar
// @access  Public
const contarLibros = asyncHandler(async (req, res, next) => {
    const count = await Libro.countDocuments()
  
    res.status(statusCode.OK).json({
      status: message.SUCCESS,
      data: { count }
    })           
})

module.exports = {
    obtenerLibros,
    obtenerLibro,
    registrarLibro,
    actualizarLibro,
    contarLibros
}