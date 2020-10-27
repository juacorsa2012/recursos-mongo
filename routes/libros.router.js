const express = require('express')
const { obtenerLibros,
        obtenerLibro,
        registrarLibro,
        contarLibros,
        actualizarLibro
        } = require('./../controllers/libros.controller')

const router = express.Router()

router.route('/contar').get(contarLibros)

router
  .route('/')
  .get(obtenerLibros)
  .post(registrarLibro)

  router
    .route('/:id')
    .get(obtenerLibro)
    .put(actualizarLibro)

module.exports = router