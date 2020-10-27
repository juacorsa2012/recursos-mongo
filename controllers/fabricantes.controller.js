const statusCode = require('http-status-codes')
const Fabricante = require('../models/fabricante.model')
const Features = require('./../utils/Features')
const message = require('../utils/message')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')

// @desc    Obtiene los fabricantes registrados
// @route   GET /api/v1/fabricantes
// @access  Public
const obtenerFabricantes = asyncHandler(async (req, res) => {    
    const features = new Features(Fabricante.find(), req.query)
      .filter()
      .sort()  
      .paginate()
  
    const fabricantes = await features.query
    
    res.status(statusCode.OK).json({
      status : message.SUCCESS,
      results: fabricantes.length,
      data   : { fabricantes }
    })
})

// @desc    Obtiene un fabricante
// @route   GET /api/v1/fabricantes/:id
// @access  Public
const obtenerFabricante = asyncHandler(async (req, res, next) => {  
    const fabricante = await Fabricante.findById(req.params.id)
  
    if (!fabricante) {     
      return next(new ErrorResponse(message.FABRICANTE_NO_ENCONTRADO, statusCode.NOT_FOUND))
    }   
         
    res.status(statusCode.OK).json({
      status: message.SUCCESS,
      data: { fabricante }
    })  
})

// @desc    Registra un nuevo fabricante
// @route   POST /api/v1/fabricante
// @access  Public
const registrarFabricante = asyncHandler(async (req, res, next) => {    
    const fabricante = await Fabricante.create(req.body)  
      
    res.status(statusCode.CREATED).json({
      status : message.SUCCESS,
      message: message.FABRICANTE_REGISTRADO,
      data   : { fabricante }
    })        
})
  
// @desc    Actualiza un fabricante
// @route   PUT /api/v1/fabricantes/:id
// @access  Public
const actualizarFabricante = asyncHandler(async (req, res, next) => {  
    const id = req.params.id   
    let fabricante = await Fabricante.findById(id)
  
    if (!fabricante) {
      return next(new ErrorResponse(message.FABRICANTE_NO_ENCONTRADO, statusCode.NOT_FOUND))
    }
      
    fabricante = await Fabricante.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })  
            
    res.status(statusCode.OK).json({
      status: message.SUCCESS,
      message: message.FABRICANTE_ACTUALIZADO,
      data: { fabricante }
    })         
})

// @desc    Obtiene el número de fabricantes registrados
// @route   GET /api/v1/fabricantes/contar
// @access  Public
const contarFabricantes = asyncHandler(async (req, res, next) => {
    const count = await Fabricante.countDocuments()
  
    res.status(statusCode.OK).json({
      status: message.SUCCESS,
      data: { count }
    })           
})
  
module.exports = {
    obtenerFabricantes,
    obtenerFabricante,
    registrarFabricante,
    actualizarFabricante,
    contarFabricantes
}  