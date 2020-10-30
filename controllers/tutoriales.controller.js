const statusCode = require('http-status-codes')
const Tutorial   = require('../models/tutorial.model')
const Features = require('./../utils/Features')
const message  = require('../utils/message')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler  = require('../middlewares/async')
const {añoActual}   = require('../utils/helpers')

// @desc    Obtiene los tutoriales registrados
// @route   GET /api/v1/tutoriales
// @access  Public
const obtenerTutoriales = asyncHandler(async (req, res) => {    
    const features = new Features(Tutorial.find().populate('tema fabricante idioma'), req.query)
      .filter()
      .sort()  
      .paginate()
  
    const tutoriales = await features.query
    
    res.status(statusCode.OK).json({
      status : message.SUCCESS,
      results: tutoriales.length,
      data   : { tutoriales }
    })
})

// @desc    Obtiene un tutorial
// @route   GET /api/v1/tutoriales/:id
// @access  Public
const obtenerTutorial = asyncHandler(async (req, res, next) => {  
  const tutorial = await (await Tutorial.findById(req.params.id).populate('tema fabricante idioma'))
  
  if (!tutorial) {     
    return next(new ErrorResponse(message.TUTORIAL_NO_ENCONTRADO, statusCode.NOT_FOUND))
  }   
       
  res.status(statusCode.OK).json({
    status: message.SUCCESS,
    data: { tutorial }
  })  
})

// @desc    Registra una nuevo tutorial
// @route   POST /api/v1/tutoriales
// @access  Public
const registrarTutorial = asyncHandler(async (req, res, next) => {    
  const { publicado } = req.body

  if (publicado > añoActual()) {
    return next(new ErrorResponse(message.PUBLICADO_MAXIMO, statusCode.BAD_REQUEST))
  }

  const tutorial = await Tutorial.create(req.body)  
    
  res.status(statusCode.CREATED).json({
    status : message.SUCCESS,
    message: message.TUTORIAL_REGISTRADO,
    data   : { tutorial }
  })        
})

// @desc    Actualiza un tutorial
// @route   PUT /api/v1/tutoriales/:id
// @access  Public
const actualizarTutorial = asyncHandler(async (req, res, next) => {  
  const { publicado } = req.body

  if (publicado > añoActual()) {
    return next(new ErrorResponse(message.PUBLICADO_MAXIMO, statusCode.BAD_REQUEST))
  }

  const id = req.params.id   
  let tutorial = await Tutorial.findById(id)
  
  if (!tutorial) {
    return next(new ErrorResponse(message.TUTORIAL_NO_ENCONTRADO, statusCode.NOT_FOUND))
  }
      
  tutorial = await Tutorial.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  })  
            
  res.status(statusCode.OK).json({
    status : message.SUCCESS,
    message: message.TUTORIAL_ACTUALIZADO,
    data   : { tutorial }
  })         
})

// @desc    Obtiene el número de tutoriales registrados
// @route   GET /api/v1/tutoriales/contar
// @access  Public
const contarTutoriales = asyncHandler(async (req, res, next) => {
  const count = await Tutorial.countDocuments()

  res.status(statusCode.OK).json({
    status: message.SUCCESS,
    data: { count }
  })           
})

module.exports = {
    obtenerTutoriales,
    obtenerTutorial,
    registrarTutorial,
    actualizarTutorial,
    contarTutoriales
}