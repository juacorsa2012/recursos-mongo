const statusCode = require('http-status-codes')
const Tema = require('../models/tema.model')
const Features = require('./../utils/Features')
const message = require('../utils/message')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')

// @desc    Obtiene los temas registrados
// @route   GET /api/v1/temas
// @access  Public
const obtenerTemas = asyncHandler(async (req, res) => {    
    const features = new Features(Tema.find(), req.query)
      .filter()
      .sort()  
      .paginate()
  
    const temas = await features.query
    
    res.status(statusCode.OK).json({
      status : message.SUCCESS,
      results: temas.length,
      data   : { temas }
    })
})

// @desc    Obtiene un tema
// @route   GET /api/v1/temas/:id
// @access  Public
const obtenerTema = asyncHandler(async (req, res, next) => {  
    const tema = await Tema.findById(req.params.id)
  
    if (!tema) {     
      return next(new ErrorResponse(message.TEMA_NO_ENCONTRADO, statusCode.NOT_FOUND))
    }   
         
    res.status(statusCode.OK).json({
      status: message.SUCCESS,
      data: { tema }
    })  
})

// @desc    Registra un nuevo tema
// @route   POST /api/v1/temas
// @access  Public
const registrarTema = asyncHandler(async (req, res, next) => {    
    const tema = await Tema.create(req.body)  
      
    res.status(statusCode.CREATED).json({
      status : message.SUCCESS,
      message: message.TEMA_REGISTRADO,
      data   : { tema }
    })        
})
  
// @desc    Actualiza un tema
// @route   PUT /api/v1/temas/:id
// @access  Public
const actualizarTema = asyncHandler(async (req, res, next) => {  
    const id = req.params.id   
    let tema = await Tema.findById(id)
  
    if (!tema) {
      return next(new ErrorResponse(message.TEMA_NO_ENCONTRADO, statusCode.NOT_FOUND))
    }
      
    tema = await Tema.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })  
            
    res.status(statusCode.OK).json({
      status: message.SUCCESS,
      message: message.TEMA_ACTUALIZADO,
      data: { tema }
    })         
})

// @desc    Obtiene el número de temas registrados
// @route   GET /api/v1/temas/contar
// @access  Public
const contarTemas = asyncHandler(async (req, res, next) => {
    const count = await Tema.countDocuments()
  
    res.status(statusCode.OK).json({
      status: message.SUCCESS,
      data: { count }
    })           
})
  
module.exports = {
    obtenerTemas,
    obtenerTema,
    registrarTema,
    actualizarTema,
    contarTemas
}  