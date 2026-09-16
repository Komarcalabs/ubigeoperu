"use strict";
const ubigeoJson = require("./ubigeo.json");

class UbigeoItem {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.level = data.level;
    Object.defineProperty(this, "data", { value: data, enumerable: false });
  }

  districts() {
    if (this.level === "province") {
      return this.data.childrens.map((item) => new UbigeoItem(item));
    }

    return console.log(
      `el elemento es de tipo ${this.level} no contiene distritos`,
    );
  }

  provinces() {
    if (this.level === "department") {
      return this.data.childrens.map((item) => new UbigeoItem(item));
    }

    return console.log(
      `el elemento es de tipo ${this.level} no contiene provincias`,
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      level: this.level,
    };
  }
}

class Ubigeo {
  constructor() {
    this.allRegions = [];
    this.allProvinces = [];
    this.allDistricts = [];
    for (const item of ubigeoJson) {
      if (item.level === "department") {
        this.allRegions.push(new UbigeoItem(item));
      }

      if (item.childrens) {
        for (const p of item.childrens) {
          this.allProvinces.push(new UbigeoItem(p));
          if (p.childrens) {
            for (const d of p.childrens) {
              this.allDistricts.push(new UbigeoItem(d));
            }
          }
        }
      }
    }
  }

  getRegions(codeOrName) {
    if (!codeOrName) return this.allRegions;

    let searchCode = String(codeOrName).trim();
    const isnum = /^\d+$/.test(searchCode);
    searchCode = isnum ? searchCode.substring(0, 2) : searchCode;
    searchCode = String(searchCode).trim().toLowerCase();

    return this.allRegions.find(
      (r) =>
        String(r.id).toLowerCase() === searchCode ||
        r.name.toLowerCase() === searchCode,
    );
  }

  getProvinces(codeOrName) {
    if (!codeOrName) return this.allProvinces;

    let searchCode = String(codeOrName).trim();
    const isnum = /^\d+$/.test(searchCode);
    searchCode = isnum ? searchCode.substring(0, 4) : searchCode;
    searchCode = searchCode.toLowerCase();

    return this.allProvinces.find(
      (r) =>
        String(r.id).toLowerCase() === searchCode ||
        String(r.name).toLowerCase() === searchCode,
    );
  }

  getDistricts(codeOrName) {
    if (!codeOrName) return this.allDistricts;

    const searchCode = String(codeOrName).trim().toLowerCase();
    return this.allDistricts.find(
      (r) =>
        String(r.id).toLowerCase() === searchCode ||
        String(r.name).toLowerCase() === searchCode,
    );
  }

  getByUbigeoCode(code) {
    if (code.length === 2) {
      return this.getRegions(code);
    }

    if (code.length === 4) {
      return this.getProvinces(code);
    }

    return this.getDistricts(code);
  }
}

class Singleton {
  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = new Ubigeo();
    }

    // eslint-disable-next-line no-constructor-return
    return Singleton.instance;
  }
}
module.exports = Singleton;
