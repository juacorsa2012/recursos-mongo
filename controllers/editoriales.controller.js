const statusCode = require('http-status-codes')
const Editorial = require('../models/editorial.model')
const Features = require('./../utils/Features')
const message = require('../utils/message')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')

// @desc    Obtiene las editoriales registradas
// @route   GET /api/v1/editoriales
// @access  Public
const obtenerEditoriales = asyncHandler(async (req, res) => {    
    const features = new Features(Editorial.find(), req.query)
      .filter()
      .sort()  
      .paginate()
  
    const editoriales = await features.query
    
    res.status(statusCode.OK).json({
      status : message.SUCCESS,
      results: editoriales.length,
      data   : { editoriales }
    })
})

// @desc    Obtiene una editorial
// @route   GET /api/v1/editoriales/:id
// @access  Public
const obtenerEditorial = asyncHandler(async (req, res, next) => {  
    const editorial = await Editorial.findById(req.params.id)
  
    if (!editorial) {     
      return next(new ErrorResponse(message.EDITORIAL_NO_ENCONTRADA, statusCode.NOT_FOUND))
    }   
         
    res.status(statusCode.OK).json({
      status: message.SUCCESS,
      data: { editorial }
    })  
})

// @desc    Registra una nueva editorial
// @route   POST /api/v1/editoriales
// @access  Public
const registrarEditorial = asyncHandler(async (req, res, next) => {    
    const editorial = await Editorial.create(req.body)  
      
    res.status(statusCode.CREATED).json({
      status : message.SUCCESS,
      message: message.EDITORIAL_REGISTRADA,
      data   : { editorial }
    })        
})
  
// @desc    Actualiza una editorial
// @route   PUT /api/v1/editoriales/:id
// @access  Public
const actualizarEditorial = asyncHandler(async (req, res, next) => {  
    const id = req.params.id   
    let editorial = await Editorial.findById(id)
  
    if (!editorial) {
      return next(new ErrorResponse(message.EDITORIAL_NO_ENCONTRADA, statusCode.NOT_FOUND))
    }
      
    editorial = await Editorial.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })  
            
    res.status(statusCode.OK).json({
      status: message.SUCCESS,
      message: message.EDITORIAL_ACTUALIZADA,
      data: { editorial }
    })         
})

// @desc    Obtiene el número de editoriales registradas
// @route   PUT /api/v1/editoriales/contar
// @access  Public
const contarEditoriales = asyncHandler(async (req, res, next) => {
    const count = await Editorial.countDocuments()
  
    res.status(statusCode.OK).json({
      status: message.SUCCESS,
      data: { count }
    })           
})
  
module.exports = {
    obtenerEditoriales,
    obtenerEditorial,
    registrarEditorial,
    contarEditoriales,
    actualizarEditorial
}  