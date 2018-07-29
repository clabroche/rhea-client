import { DictionnaireService } from "./dictionnaire.service";

describe('DictionnaireService', () => {
  it('#load', () => {
    const service = new DictionnaireService()
    class Test {
      
    }
    service['dico'].test = Test 
    const test = service.load("test", {
      test: { a: "mdlkamdlke" }
    })
    expect(test instanceof Test).toEqual(true)
    const test2 = service.load("tes", {
      tes: { a: "mdlkamdlke" }
    })
    expect(test2 instanceof Test).toEqual(false)
  })
})