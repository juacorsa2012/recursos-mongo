const express = require('express')
const { obtenerLibros,
        obtenerLibro,
        registrarLibro,
        contarLibros,
        contarPaginas,
        actualizarLibro,
        obtenerLibrosPorTema,
        obtenerLibrosPorPublicado,
        obtenerLibrosPorEditorial,
        obtenerLibrosPorIdioma,
        obtenerLibrosPorTemaPublicado,
        obtenerLibrosPorEditorialPublicado
      } = require('./../controllers/libros.controller')

const router = express.Router()

router.route('/stats/libros').get(contarLibros)
router.route('/stats/paginas').get(contarPaginas)
router.get('/stats/temas', obtenerLibrosPorTema)
router.get('/stats/publicado', obtenerLibrosPorPublicado)
router.get('/stats/editorial', obtenerLibrosPorEditorial)
router.get('/stats/idioma', obtenerLibrosPorIdioma)
router.get('/stats/tema/publicado', obtenerLibrosPorTemaPublicado)
router.get('/stats/editorial/publicado', obtenerLibrosPorEditorialPublicado)

router
  .route('/')
  .get(obtenerLibros)
  .post(registrarLibro)

  router
    .route('/:id')
    .get(obtenerLibro)
    .put(actualizarLibro)

module.exports = router
