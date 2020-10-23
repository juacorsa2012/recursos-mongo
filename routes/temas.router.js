
const express = require('express')
const { obtenerTemas, 
        obtenerTema, 
        contarTemas,
        actualizarTema,
        registrarTema } = require('./../controllers/temas.controller')

const router = express.Router()

router.route('/contar').get(contarTemas)

router
  .route('/')
  .get(obtenerTemas)
  .post(registrarTema)

router
  .route('/:id')
  .get(obtenerTema)
  .put(actualizarTema)

module.exports = router