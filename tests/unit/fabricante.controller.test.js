const FabricanteController = require("../../controllers/fabricantes.controller")

describe("FabricanteController", () => {    
  it("debería existir un función llamada obtenerFabricantes", () => {
    expect(typeof FabricanteController.obtenerFabricantes).toBe("function")
  })

  it("debería existir un función llamada obtenerFabricante", () => {
    expect(typeof FabricanteController.obtenerFabricante).toBe("function")
  })

  it("debería existir un función llamada registrarFabricante", () => {
    expect(typeof FabricanteController.registrarFabricante).toBe("function")
  })

  it("debería existir un función llamada actualizarFabricante", () => {
    expect(typeof FabricanteController.actualizarFabricante).toBe("function")
  })

  it("debería existir un función llamada contarFabricantes", () => {
    expect(typeof FabricanteController.contarFabricantes).toBe("function")
  })
})