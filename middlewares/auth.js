import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import StatusCodes  from 'http-status-codes'
import Usuario from '../models/usuario.model.js'
import Message from '../utils/messages.js'
import errorResponse from '../utils/errorResponse.js'

const protegido = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]    
  }
  
  if (!token) {    
    errorResponse(Message.NO_AUTORIZADO, StatusCodes.UNAUTHORIZED, res)
  }

  try {    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = await Usuario.findById(decoded.id)
    next();
  } catch (err) {
      errorResponse(Message.NO_AUTORIZADO, StatusCodes.UNAUTHORIZED, res)      
  }
})

const autorizado = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      errorResponse(Message.NO_AUTORIZADO, StatusCodes.UNAUTHORIZED, res)   
    }
    next();
  }
}

export { protegido, autorizado }
