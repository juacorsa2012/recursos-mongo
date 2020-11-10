const statusCode = require('http-status-codes')
const Tutorial   = require('../models/tutorial.model')
const Tema       = require('../models/tema.model')
const Idioma     = require('../models/idioma.model')
const Fabricante = require('../models/fabricante.model')
const Features = require('./../utils/Features')
const message  = require('../utils/message')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler  = require('../middlewares/async')
const {añoActual, numeroConSeparadorMiles}   = require('../utils/helpers')

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
  const { publicado, tema, idioma, fabricante } = req.body

  if (publicado > añoActual()) {
    return next(new ErrorResponse(message.PUBLICADO_MAXIMO, statusCode.BAD_REQUEST))
  }

  if (!await Tema.findById(tema)) {    
    return next(new ErrorResponse(message.TEMA_NO_ENCONTRADO, statusCode.BAD_REQUEST))
  }  
  
  if (!await Idioma.findById(idioma)) {    
    return next(new ErrorResponse(message.IDIOMA_NO_ENCONTRADO, statusCode.BAD_REQUEST))
  }
  
  if (!await Fabricante.findById(fabricante)) {    
    return next(new ErrorResponse(message.FABRICANTE_NO_ENCONTRADO, statusCode.BAD_REQUEST))
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
// @route   GET /api/v1/libros/stats/tutoriales
// @access  Public
const contarTutoriales = asyncHandler(async (req, res, next) => {    
  const tutoriales = await Tutorial.obtenerTutorialesTotales()
  const count = numeroConSeparadorMiles(tutoriales[0].sum)

  res.status(statusCode.OK).json({
    status : message.SUCCESS,
    data   : { count }
  })           
})

// @desc    Obtiene la duración total en minutos
// @route   GET /api/v1/libros/stats/duracion
// @access  Public
const contarDuracionTotal = asyncHandler(async (req, res, next) => {    
  const duracion = await Tutorial.obtenerTotalDuracion()
  const count = numeroConSeparadorMiles(duracion[0].sum)

  res.status(statusCode.OK).json({
    status : message.SUCCESS,
    data   : { count }
  })           
})

// @desc    Obtiene un agrupado de tutoriales por temas
// @route   GET /api/v1/tutoriales/stats/temas
// @access  Public
const obtenerTutorialesPorTema = asyncHandler(async (req, res, next) => {   
  const tutoriales = await Tutorial.obtenerTutorialesTotales()
  const count = numeroConSeparadorMiles(tutoriales[0].sum)
  const data = await Tutorial.obtenerTutorialesPorTema()

  res.status(statusCode.OK).json({ 
    status : message.SUCCESS,
    count,
    data 
  })
})

// @desc    Obtiene un agrupado de tutoriales por año de publicación
// @route   GET /api/v1/tutoriales/stats/publicado
// @access  Public
const obtenerTutorialesPorPublicado = asyncHandler(async (req, res, next) => {   
  const tutoriales = await Tutorial.obtenerTutorialesTotales()
  const count = numeroConSeparadorMiles(tutoriales[0].sum)
  const data = await Tutorial.obtenerTutorialesPorPublicado()

  res.status(statusCode.OK).json({ 
    status : message.SUCCESS,
    count,
    data 
  })
})

// @desc    Obtiene un agrupado de tutoriales por idioma
// @route   GET /api/v1/tutoriales/stats/idioma
// @access  Public
const obtenerTutorialesPorIdioma = asyncHandler(async (req, res, next) => {   
  const tutoriales = await Tutorial.obtenerTutorialesTotales()
  const count = numeroConSeparadorMiles(tutoriales[0].sum)
  const data = await Tutorial.obtenerTutorialesPorIdioma()

  res.status(statusCode.OK).json({ 
    status : message.SUCCESS,
    count,
    data 
  })
})

// @desc    Obtiene un agrupado de tutoriales por fabricante
// @route   GET /api/v1/tutoriales/stats/fabricante
// @access  Public
const obtenerTutorialesPorFabricante = asyncHandler(async (req, res, next) => {   
  const tutoriales = await Tutorial.obtenerTutorialesTotales()
  const count = numeroConSeparadorMiles(tutoriales[0].sum)
  const data = await Tutorial.obtenerTutorialesPorFabricante()

  res.status(statusCode.OK).json({ 
    status : message.SUCCESS,
    count,
    data 
  })
})

// @desc    Obtiene un agrupado de tutoriales por tema y año de publicación
// @route   GET /api/v1/tutoriales/stats/tema/publicado
// @access  Public
const obtenerTutorialesPorTemaPublicado = asyncHandler(async (req, res, next) => {   
  const tutoriales = await Tutorial.obtenerTutorialesTotales()
  const count = numeroConSeparadorMiles(tutoriales[0].sum)
  const data = await Tutorial.obtenerTutorialesPorTemaPublicado()

  res.status(statusCode.OK).json({ 
    status : message.SUCCESS,
    count,
    data 
  })
})

// @desc    Obtiene un agrupado de tutoriales por tema y fabricante
// @route   GET /api/v1/tutoriales/stats/tema/fabricante
// @access  Public
const obtenerTutorialesPorTemaFabricante = asyncHandler(async (req, res, next) => {   
  const tutoriales = await Tutorial.obtenerTutorialesTotales()
  const count = numeroConSeparadorMiles(tutoriales[0].sum)
  const data = await Tutorial.obtenerTutorialesPorTemaFabricante()

  res.status(statusCode.OK).json({ 
    status : message.SUCCESS,
    count,
    data 
  })
})

// @desc    Obtiene un agrupado de tutoriales por tema e idioma
// @route   GET /api/v1/tutoriales/stats/tema/idioma
// @access  Public
const obtenerTutorialesPorTemaIdioma = asyncHandler(async (req, res, next) => {   
  const tutoriales = await Tutorial.obtenerTutorialesTotales()
  const count = numeroConSeparadorMiles(tutoriales[0].sum)
  const data = await Tutorial.obtenerTutorialesPorTemaFabricante()

  res.status(statusCode.OK).json({ 
    status : message.SUCCESS,
    count,
    data 
  })
})

module.exports = {
    obtenerTutoriales,
    obtenerTutorial,
    registrarTutorial,
    actualizarTutorial,
    contarTutoriales,
    contarDuracionTotal,
    obtenerTutorialesPorTema,
    obtenerTutorialesPorPublicado,
    obtenerTutorialesPorIdioma,
    obtenerTutorialesPorFabricante,
    obtenerTutorialesPorTemaPublicado,
    obtenerTutorialesPorTemaFabricante,
    obtenerTutorialesPorTemaIdioma
}