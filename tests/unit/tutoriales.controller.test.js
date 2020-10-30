const TutorialController = require('../../controllers/tutoriales.controller')

describe("TutorialController", () => {    
  it("debería existir un función llamada obtenerTutoriales", () => {
    expect(typeof TutorialController.obtenerTutoriales).toBe("function")
  })

  it("debería existir un función llamada obtenerTutorial", () => {
    expect(typeof TutorialController.obtenerTutorial).toBe("function")
  })

  it("debería existir un función llamada registrarTutorial", () => {
    expect(typeof TutorialController.registrarTutorial).toBe("function")
  })

  it("debería existir un función llamada actualizarTutorial", () => {
    expect(typeof TutorialController.actualizarTutorial).toBe("function")
  })

  it("debería existir un función llamada contarTutoriales", () => {
    expect(typeof TutorialController.contarTutoriales).toBe("function")
  })
})