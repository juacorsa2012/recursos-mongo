const LibroController = require('../../controllers/libros.controller')

describe("LibroController", () => {    
  it("debería existir un función llamada obtenerLibros", () => {
    expect(typeof LibroController.obtenerLibros).toBe("function")
  })

  it("debería existir un función llamada obtenerLibro", () => {
    expect(typeof LibroController.obtenerLibro).toBe("function")
  })

  it("debería existir un función llamada registrarLibro", () => {
    expect(typeof LibroController.registrarLibro).toBe("function")
  })

  it("debería existir un función llamada actualizarLibro", () => {
    expect(typeof LibroController.actualizarLibro).toBe("function")
  })

  it("debería existir un función llamada contarLibros", () => {
    expect(typeof LibroController.contarLibros).toBe("function")
  })
})