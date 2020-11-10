
const express = require('express')
const { obtenerEditoriales,
        obtenerEditorial,
        contarEditoriales,
        actualizarEditorial,
        registrarEditorial 
      } = require('./../controllers/editoriales.controller')

const { protegido } = require('../controllers/auth.controller')

const router = express.Router()

router.route('/contar').get(contarEditoriales)

router
  .route('/')
  .get(obtenerEditoriales)
  .post(registrarEditorial)

router
  .route('/:id')
  .get(obtenerEditorial)
  .put(actualizarEditorial)

module.exports = router