
const express = require('express')
const { obtenerTemas, 
        obtenerTema, 
        contarTemas,
        actualizarTema,
        registrarTema 
      } = require('./../controllers/temas.controller')

const { protegido } = require('../controllers/auth.controller')

const router = express.Router()

router.route('/contar').get(contarTemas)

router
  .route('/')
  .get(protegido, obtenerTemas)
  .post(registrarTema)

router
  .route('/:id')
  .get(obtenerTema)
  .put(actualizarTema)

module.exports = router