const TemaController = require('../../controllers/temas.controller')

describe("TemaController", () => {    
  it("debería existir un función llamada obtenerTemas", () => {
    expect(typeof TemaController.obtenerTemas).toBe("function")
  })

  it("debería existir un función llamada obtenerTema", () => {
    expect(typeof TemaController.obtenerTema).toBe("function")
  })

  it("debería existir un función llamada crearTema", () => {
    expect(typeof TemaController.registrarTema).toBe("function")
  })

  it("debería existir un función llamada actualizarTema", () => {
    expect(typeof TemaController.actualizarTema).toBe("function")
  })

  it("debería existir un función llamada contarTemas", () => {
    expect(typeof TemaController.contarTemas).toBe("function")
  })
})