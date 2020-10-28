const EditorialController = require('../../controllers/editoriales.controller')

describe("EditorialController", () => {    
  it("debería existir un función llamada obtenerEditoriales", () => {
    expect(typeof EditorialController.obtenerEditoriales).toBe("function")
  })

  it("debería existir un función llamada obtenerEditorial", () => {
    expect(typeof EditorialController.obtenerEditorial).toBe("function")
  })

  it("debería existir un función llamada registrarEditorial", () => {
    expect(typeof EditorialController.registrarEditorial).toBe("function")
  })

  it("debería existir un función llamada actualizarEditorial", () => {
    expect(typeof EditorialController.actualizarEditorial).toBe("function")
  })

  it("debería existir un función llamada contarEditoriales", () => {
    expect(typeof EditorialController.contarEditoriales).toBe("function")
  })
})