const dotenv = require('dotenv')
const express = require('express')
const statusCode = require('http-status-codes')
const ErrorResponse = require('./utils/errorResponse')
const errorHandler = require('./middlewares/error')
const temasRouter = require('./routes/temas.router')
const editorialesRouter = require('./routes/editoriales.router')
const idiomasRouter = require('./routes/idiomas.router')
const fabricantesRouter = require('./routes/fabricantes.router')
const librosRouter = require('./routes/libros.router')
const tutorialesRouter = require('./routes/tutoriales.router')
const usuariosRouter = require('./routes/usuario.router')
const message = require('./utils/message')
const conectarDB = require('./config/db')

const cors = require('cors');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')
const hpp = require('hpp')

const PETICIONES = 100

dotenv.config({ path: './config/.env' })

const app = express()

app.use(express.json())

const limiter = rateLimit({
    max: PETICIONES,
    windowMs: 60 * 60 * 1000,
    message: message.LIMITE_PETICIONES
})
  
app.use(cors())
app.use('/api/v1/', limiter)
app.use(helmet())
app.use(mongoSanitize())
app.use(xss())
app.use(hpp())

conectarDB()

app.use('/api/v1/temas', temasRouter)
app.use('/api/v1/idiomas', idiomasRouter)
app.use('/api/v1/fabricantes', fabricantesRouter)
app.use('/api/v1/editoriales', editorialesRouter)
app.use('/api/v1/libros', librosRouter)
app.use('/api/v1/tutoriales', tutorialesRouter)
app.use('/api/v1/usuarios', usuariosRouter)

app.all('*', (req, res, next) => {
    next(new ErrorResponse(`Imposible encontrar ${req.originalUrl} en este servidor!`, statusCode.NOT_FOUND))
})

app.use(errorHandler)
  
module.exports = app