const express = require('express')
const { obtenerTutoriales, 
        obtenerTutorial,
        registrarTutorial,
        contarTutoriales,
        actualizarTutorial
      } = require('./../controllers/tutoriales.controller')

const router = express.Router()

router.route('/contar').get(contarTutoriales)

router
  .route('/')
  .get(obtenerTutoriales)
  .post(registrarTutorial)

router
  .route('/:id')
  .get(obtenerTutorial)
  .put(actualizarTutorial)
  
module.exports = router