
const StatusCodes = require('http-status-codes')
const ErrorResponse = require('../utils/errorResponse')
const message = require('../utils/message')

const errorHandler = (err, req, res, next) => {
  let error = { ...err }  
  error.message = err.message     
  
  if (err.name === 'CastError') {
    const message = `${err.value} no es un objectId de Mongoose válido`
    error = new ErrorResponse(message, StatusCodes.BAD_REQUEST)
  }
  
  if (err.name === 'ValidationError') {   
    const errors  = Object.values(err.errors).map(el => el.message)
    const message = `${errors.join('.')}`
    error = new ErrorResponse(message, StatusCodes.BAD_REQUEST)
  }
  
  if (err.code === 11000) {  
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]    
    const message = `${value} ya existe en la base de datos`
    error = new ErrorResponse(message, StatusCodes.BAD_REQUEST)
  }

  res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: error.message || Message.INTERNAL_SERVER_ERROR
  })
}

module.exports = errorHandler