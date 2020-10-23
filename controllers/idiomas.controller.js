const statusCode = require('http-status-codes')
const Idioma = require('../models/idioma.model')
const Features = require('./../utils/Features')
const message = require('../utils/message')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')

// @desc    Obtiene los idiomas registrados
// @route   GET /api/v1/idiomas
// @access  Public
const obtenerIdiomas = asyncHandler(async (req, res) => {    
    const features = new Features(Idioma.find(), req.query)
      .filter()
      .sort()  
      .paginate()
  
    const idiomas = await features.query
    
    res.status(statusCode.OK).json({
      status : message.SUCCESS,
      results: idiomas.length,
      data   : { idiomas }
    })
})

// @desc    Obtiene un idioma
// @route   GET /api/v1/idiomas/:id
// @access  Public
const obtenerIdioma = asyncHandler(async (req, res, next) => {  
    const idioma = await Idioma.findById(req.params.id)
  
    if (!idioma) {     
      return next(new ErrorResponse(message.IDIOMA_NO_ENCONTRADO_NO_ENCONTRADO, statusCode.NOT_FOUND))
    }   
         
    res.status(statusCode.OK).json({
      status: message.SUCCESS,
      data: { idioma }
    })  
})

// @desc    Registra un nuevo idioma
// @route   POST /api/v1/idiomas
// @access  Public
const registrarIdioma = asyncHandler(async (req, res, next) => {    
    const idioma = await Idioma.create(req.body)  
      
    res.status(statusCode.CREATED).json({
      status : message.SUCCESS,
      message: message.IDIOMA_REGISTRADO,
      data   : { idioma }
    })        
})
  
// @desc    Actualiza un idioma
// @route   PUT /api/v1/idiomas/:id
// @access  Public
const actualizarIdioma = asyncHandler(async (req, res, next) => {  
    const id = req.params.id   
    let idioma = await Idioma.findById(id)
  
    if (!idioma) {
      return next(new ErrorResponse(message.IDIOMA_NO_ENCONTRADO, statusCode.NOT_FOUND))
    }
      
    idioma = await Idioma.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })  
            
    res.status(StatusCodes.OK).json({
      status: message.SUCCESS,
      message: message.IDIOMA_ACTUALIZADO,
      data: { idioma }
    })         
})

// @desc    Obtiene el número de temas registrados
// @route   PUT /api/v1/temas/contar
// @access  Public
const contarIdiomas = asyncHandler(async (req, res, next) => {
    const count = await Idioma.countDocuments()
  
    res.status(statusCode.OK).json({
      status: message.SUCCESS,
      data: { count }
    })           
})
  
module.exports = {
    obtenerIdiomas,
    obtenerIdioma,
    registrarIdioma,
    actualizarIdioma,
    contarIdiomas
}  