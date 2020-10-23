const express = require('express')
const { obtenerIdiomas,
        obtenerIdioma, 
        contarIdiomas,
        actualizarIdioma,
        registrarIdioma } = require('./../controllers/idiomas.controller')

const router = express.Router()

router.route('/contar').get(contarIdiomas)

router
  .route('/')
  .get(obtenerIdiomas)
  .post(registrarIdioma)

router
  .route('/:id')
  .get(obtenerIdioma)
  .put(actualizarIdioma)

module.exports = router