const express = require('express')
const { obtenerTutoriales, 
        obtenerTutorial,
        registrarTutorial,
        contarTutoriales,
        actualizarTutorial,
        contarDuracionTotal,
        obtenerTutorialesPorTema,
        obtenerTutorialesPorPublicado,
        obtenerTutorialesPorIdioma,
        obtenerTutorialesPorFabricante,
        obtenerTutorialesPorTemaPublicado,
        obtenerTutorialesPorTemaFabricante,
        obtenerTutorialesPorTemaIdioma
      } = require('./../controllers/tutoriales.controller')

const { protegido } = require('../controllers/auth.controller')      

const router = express.Router()

router.route('/stats/tutoriales').get(contarTutoriales)
router.route('/stats/duracion').get(contarDuracionTotal)
router.get('/stats/temas', obtenerTutorialesPorTema)
router.get('/stats/publicado', obtenerTutorialesPorPublicado)
router.get('/stats/idioma', obtenerTutorialesPorIdioma)
router.get('/stats/fabricante', obtenerTutorialesPorFabricante)
router.get('/stats/tema/publicado', obtenerTutorialesPorTemaPublicado)
router.get('/stats/tema/fabricante', obtenerTutorialesPorTemaFabricante)
router.get('/stats/tema/idioma', obtenerTutorialesPorTemaIdioma)

router
  .route('/')
  .get(obtenerTutoriales)
  .post(registrarTutorial)

router
  .route('/:id')
  .get(obtenerTutorial)
  .put(actualizarTutorial)
  
module.exports = router
