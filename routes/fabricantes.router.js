
const express = require('express')
const { obtenerFabricantes, 
        obtenerFabricante, 
        contarFabricantes,
        actualizarFabricante,
        registrarFabricante } = require('./../controllers/fabricantes.controller')

const router = express.Router()

router.route('/contar').get(contarFabricantes)

router
  .route('/')
  .get(obtenerFabricantes)
  .post(registrarFabricante)

router
  .route('/:id')
  .get(obtenerFabricante)
  .put(actualizarFabricante)

module.exports = router