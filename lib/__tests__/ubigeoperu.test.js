const assert = require("assert");
const Ubigeoperu = require("../index.js");

describe("ubigeoperu", () => {
  const ubigeo = new Ubigeoperu();

  describe("Métodos Generales de Colección", () => {
    it("Debe devolver el listado completo de departamentos", () => {
      const list = ubigeo.getRegions();
      assert.ok(
        list.length > 0,
        "El listado de departamentos no debe estar vacío",
      );
      assert.strictEqual(list[0].level, "department");
    });

    it("Debe devolver el listado completo de provincias", () => {
      const list = ubigeo.getProvinces();
      assert.ok(
        list.length > 0,
        "El listado de provincias no debe estar vacío",
      );
      assert.strictEqual(list[0].level, "province");
    });

    it("Debe devolver el listado completo de distritos", () => {
      const list = ubigeo.getDistricts();
      assert.ok(list.length > 0, "El listado de distritos no debe estar vacío");
      assert.strictEqual(list[0].level, "district");
    });
  });

  describe("Búsquedas por Nombre", () => {
    it("Debe encontrar una región (departamento) por su nombre exacto o en minúsculas", () => {
      const data = ubigeo.getRegions("Lima");
      assert.ok(data, "Debe existir el departamento Lima");
      assert.strictEqual(data.id, "15");
      assert.strictEqual(data.name.toLowerCase(), "lima");

      const dataMinuscula = ubigeo.getRegions("amazonas");
      assert.strictEqual(dataMinuscula.id, "01");
    });

    it("Debe encontrar una provincia por su nombre", () => {
      const data = ubigeo.getProvinces("Chachapoyas");
      assert.ok(data, "Debe encontrar la provincia Chachapoyas");
      assert.strictEqual(data.id, "0101");
    });

    it("Debe encontrar un distrito por su nombre", () => {
      const data = ubigeo.getDistricts("Miraflores");
      assert.ok(data, "Debe encontrar un distrito Miraflores");
      assert.strictEqual(data.level, "district");
    });
  });

  describe("Búsquedas por Código", () => {
    it("Debe encontrar una región por su código de 2 dígitos", () => {
      const data = ubigeo.getRegions("15");
      assert.ok(data);
      assert.strictEqual(data.name, "Lima");
    });

    it("Debe encontrar una provincia por su código de 4 dígitos", () => {
      const data = ubigeo.getProvinces("1501");
      assert.ok(data);
      assert.strictEqual(data.name, "Lima");
      assert.strictEqual(data.level, "province");
    });

    it("Debe encontrar un distrito por su código de 6 dígitos", () => {
      const data = ubigeo.getDistricts("150122");
      assert.ok(data);
      assert.strictEqual(data.name, "Miraflores");
    });

    it("Debe truncar códigos largos si se buscan en funciones de menor nivel", () => {
      // Si se pasa 150122 a getRegions, debería buscar internamente solo "15"
      const data = ubigeo.getRegions("150122");
      assert.ok(data);
      assert.strictEqual(data.id, "15");
    });
  });

  describe("getByUbigeoCode (Resolución Dinámica)", () => {
    it("Debe retornar un departamento si el código es de 2 dígitos", () => {
      const data = ubigeo.getByUbigeoCode("01");
      assert.ok(data);
      assert.strictEqual(data.level, "department");
      assert.strictEqual(data.name, "Amazonas");
    });

    it("Debe retornar una provincia si el código es de 4 dígitos", () => {
      const data = ubigeo.getByUbigeoCode("0101");
      assert.ok(data);
      assert.strictEqual(data.level, "province");
      assert.strictEqual(data.name, "Chachapoyas");
    });

    it("Debe retornar un distrito si el código es de 6 dígitos", () => {
      const data = ubigeo.getByUbigeoCode("010119");
      assert.ok(data);
      assert.strictEqual(data.level, "district");
      assert.strictEqual(data.name, "San Isidro de Maino");
    });

    it("Debe retornar undefined si el código no existe", () => {
      const data = ubigeo.getByUbigeoCode("999999");
      assert.strictEqual(data, undefined);
    });
  });

  describe("Navegación en Árbol (Instancias de UbigeoItem)", () => {
    it("Un departamento debe contener provincias", () => {
      const region = ubigeo.getRegions("01");
      assert.ok(region);
      const provincias = region.provinces();
      assert.ok(Array.isArray(provincias));
      assert.ok(provincias.length > 0);
      assert.strictEqual(provincias[0].level, "province");
    });

    it("Una provincia debe contener distritos", () => {
      const provincia = ubigeo.getProvinces("0101");
      assert.ok(provincia);
      const distritos = provincia.districts();
      assert.ok(Array.isArray(distritos));
      assert.ok(distritos.length > 0);
      assert.strictEqual(distritos[0].level, "district");
    });

    it("Llamar a un método de un nivel incorrecto debe retornar undefined", () => {
      const distrito = ubigeo.getDistricts("010101");
      // Districts() en un distrito no existe (devuelve un console.log y undefined)
      assert.strictEqual(distrito.districts(), undefined);
      assert.strictEqual(distrito.provinces(), undefined);
    });
  });
});
