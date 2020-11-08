const statusCode = require('http-status-codes')
const Libro = require('../models/libro.model')
const Features = require('./../utils/Features')
const message = require('../utils/message')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const {añoActual, numeroConSeparadorMiles} = require('../utils/helpers')
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
// @route   GET /api/v1/libros/stats/paginas
// @access  Public
const contarLibros = asyncHandler(async (req, res, next) => {    
    const libros = await Libro.obtenerLibrosTotales()
    const count = numeroConSeparadorMiles(libros[0].sum)

    res.status(statusCode.OK).json({
      status : message.SUCCESS,
      data   : { count }
    })           
})

// @desc    Obtiene el número de páginas totales de libros
// @route   GET /api/v1/libros/stats/paginas
// @access  Public
const contarPaginas = asyncHandler(async (req, res, next) => {
  const paginas = await Libro.obtenerPaginasTotales()
  const count = numeroConSeparadorMiles(paginas[0].sum)

  res.status(statusCode.OK).json({
    status : message.SUCCESS,
    data   : { count }
  })           
})

// @desc    Obtiene un agrupado de libros por temas
// @route   GET /api/v1/libros/stats/temas
// @access  Public
const obtenerLibrosPorTema = asyncHandler(async (req, res, next) => {  
  const paginas = await Libro.obtenerLibrosTotales()
  const count   = numeroConSeparadorMiles(paginas[0].sum)
	const data = await Libro.obtenerLibrosPorTema()

  res.status(statusCode.OK).json({ 
    status : message.SUCCESS,
    count,
    data 
  })
})

// @desc    Obtiene un agrupado de libros por año de publicación
// @route   GET /api/v1/libros/stats/publicado
// @access  Public
const obtenerLibrosPorPublicado = asyncHandler(async (req, res, next) => {  
  const paginas = await Libro.obtenerLibrosTotales()
  const count   = numeroConSeparadorMiles(paginas[0].sum)
	const data = await Libro.obtenerLibrosPorPublicado()

  res.status(statusCode.OK).json({ 
    status : message.SUCCESS,
    count,
    data 
  })
})

// @desc    Obtiene un agrupado de libros por editorial
// @route   GET /api/v1/libros/stats/editorial
// @access  Public
const obtenerLibrosPorEditorial = asyncHandler(async (req, res, next) => {  
  const paginas = await Libro.obtenerLibrosTotales()
  const count   = numeroConSeparadorMiles(paginas[0].sum)
	const data = await Libro.obtenerLibrosPorEditorial()

  res.status(statusCode.OK).json({ 
    status : message.SUCCESS,
    count,
    data 
  })
})

// @desc    Obtiene un agrupado de libros por idioma
// @route   GET /api/v1/libros/stats/idioma
// @access  Public
const obtenerLibrosPorIdioma = asyncHandler(async (req, res, next) => {  
  const paginas = await Libro.obtenerLibrosTotales()
  const count   = numeroConSeparadorMiles(paginas[0].sum)
	const data = await Libro.obtenerLibrosPorIdioma()

  res.status(statusCode.OK).json({ 
    status : message.SUCCESS,
    count,
    data 
  })
})

// @desc    Obtiene un agrupado de libros por tema y año de publicación
// @route   GET /api/v1/libros/stats/tema/publicado
// @access  Public
const obtenerLibrosPorTemaPublicado = asyncHandler(async (req, res, next) => {  
  const paginas = await Libro.obtenerLibrosTotales()
  const count   = numeroConSeparadorMiles(paginas[0].sum)
	const data = await Libro.obtenerLibrosPorTemaPublicado()

  res.status(statusCode.OK).json({ 
    status : message.SUCCESS,
    count,
    data 
  })
})

// @desc    Obtiene un agrupado de libros por editorial y año de publicación
// @route   GET /api/v1/libros/stats/editorial/publicado
// @access  Public
const obtenerLibrosPorEditorialPublicado = asyncHandler(async (req, res, next) => {  
  const paginas = await Libro.obtenerLibrosTotales()
  const count   = numeroConSeparadorMiles(paginas[0].sum)
	const data = await Libro.obtenerLibrosPorEditorialPublicado()

  res.status(statusCode.OK).json({ 
    status : message.SUCCESS,
    count,
    data 
  })
})

module.exports = {
    obtenerLibros,
    obtenerLibro,
    registrarLibro,
    actualizarLibro,
    contarLibros,
    contarPaginas,
    obtenerLibrosPorTema,
    obtenerLibrosPorPublicado,
    obtenerLibrosPorEditorial,
    obtenerLibrosPorIdioma,
    obtenerLibrosPorTemaPublicado,
    obtenerLibrosPorEditorialPublicado
}