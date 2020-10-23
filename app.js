const express = require('express')
const statusCode = require('http-status-codes')
const ErrorResponse = require('./utils/errorResponse')
const errorHandler = require('./middlewares/error')
const temasRouter = require('./routes/temas.router')
const editorialesRouter = require('./routes/editoriales.router')
const idiomasRouter = require('./routes/idiomas.router')
const fabricantesRouter = require('./routes/fabricantes.router')

const app = express()

app.use(express.json())

app.use('/api/v1/temas', temasRouter)
app.use('/api/v1/idiomas', idiomasRouter)
app.use('/api/v1/fabricantes', fabricantesRouter)
app.use('/api/v1/editoriales', editorialesRouter)
//app.use('/api/v1/libros', librosRouter)
//app.use('/api/v1/tutoriales', tutorialesRouter)

app.all('*', (req, res, next) => {
    next(new ErrorResponse(`Imposible encontrar ${req.originalUrl} en este servidor!`, statusCode.NOT_FOUND))
})

app.use(errorHandler)
  
module.exports = app