const statusCode = require('http-status-codes')
const jwt = require('jsonwebtoken')
const message = require('../utils/message')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const { promisify } = require('util')
const Usuario = require('../models/usuario.model')

const crearToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const registro = asyncHandler(async (req, res, next) => {
    const usuario = await Usuario.create(req.body)
    const token = crearToken(usuario._id)
    
    res.status(statusCode.CREATED).json({ 
        status: message.SUCCESS,
        token 
    })
})

const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {        
        return next(new ErrorResponse(message.CREDENCIALES_INCORRECTAS, statusCode.BAD_REQUEST))
    }

    const usuario = await Usuario.findOne({ email }).select('+password')

    if (!usuario || !(await usuario.esPasswordCorrecto(password, usuario.password)))
    {        
        return next(new ErrorResponse(message.CREDENCIALES_INCORRECTAS, statusCode.UNAUTHORIZED))
    }    
    
    const token = crearToken(usuario._id);

    res.status(statusCode.OK).json({ 
        status: message.SUCCESS,
        token 
    })
})

const protegido = asyncHandler(async (req, res, next) => {    
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
  
    if (!token) {
      return next(new ErrorResponse(message.INICIAR_SESION, statusCode.UNAUTHORIZED))
    }  
    
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
      
    const usuario = await Usuario.findById(decoded.id)

    if (!usuario) {
      return next(new ErrorResponse(message.USUARIO_REQUERIDO, statusCode.UNAUTHORIZED))
    }  
    
    req.usuario = usuario
    next()
})

const rol = (...roles) => {
    return (req, res, next) => {      
      if (!roles.includes(req.usuario.rol)) {
        return next(new ErrorResponse(message.SIN_PERMISOS, statusCode.UNAUTHORIZED));
      }  
      next()
    }
}

module.exports = {
    registro,
    login,
    protegido,
    rol
}