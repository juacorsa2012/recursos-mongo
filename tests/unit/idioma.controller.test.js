const IdiomaController = require("./../../controllers/idiomas.controller")

describe("IdiomaController", () => {    
  it("debería existir un función llamada obtenerIdiomas", () => {
    expect(typeof IdiomaController.obtenerIdiomas).toBe("function")
  })

  it("debería existir un función llamada obtenerIdioma", () => {
    expect(typeof IdiomaController.obtenerIdioma).toBe("function")
  })

  it("debería existir un función llamada crearIdioma", () => {
    expect(typeof IdiomaController.registrarIdioma).toBe("function")
  })

  it("debería existir un función llamada actualizarIdioma", () => {
    expect(typeof IdiomaController.actualizarIdioma).toBe("function")
  })

  it("debería existir un función llamada contarIdiomas", () => {
    expect(typeof IdiomaController.contarIdiomas).toBe("function")
  })
})