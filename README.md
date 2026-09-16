<div align="center">
  
# 🇵🇪 Peru Ubigeo

**Librería simple, moderna y actualizada para consultar códigos de ubigeo del Perú**

[![NPM Version](https://badge.fury.io/js/peru-ubigeo.svg)](https://npmjs.org/package/peru-ubigeo)
[![Build Status](https://github.com/Komarcalabs/ubigeoperu/actions/workflows/ci.yml/badge.svg)](https://github.com/Komarcalabs/ubigeoperu/actions/workflows/ci.yml)
[![Dependency Status](https://david-dm.org/Komarcalabs/ubigeoperu.svg?theme=shields.io)](https://david-dm.org/Komarcalabs/ubigeoperu)
[![Coverage percentage](https://coveralls.io/repos/Komarcalabs/ubigeoperu/badge.svg)](https://coveralls.io/r/Komarcalabs/ubigeoperu)

*Supported by **[KomarcaLabs](https://github.com/Komarcalabs)***
  
</div>

---

`peru-ubigeo` es una herramienta ligera para Node.js y TypeScript que te permite obtener fácilmente los **Departamentos, Provincias y Distritos** del Perú de acuerdo a sus Códigos de Ubicación Geográfica (Ubigeo).

✨ **Características principales:**
- 🔄 **Datos al día**: Incluye los distritos peruanos de más reciente creación.
- 📘 **TypeScript Ready**: Cuenta con tipado completo (`index.d.ts`) nativo.
- ⚡ **Sin dependencias**: Muy liviano, carga instantánea y huella de memoria nula.
- 🌳 **Navegación en Árbol**: Navega jerárquicamente desde el departamento hasta sus distritos.

---

## 📦 Instalación

Usando npm:
```bash
npm install peru-ubigeo
```

Usando yarn:
```bash
yarn add peru-ubigeo
```

---

## 🚀 Uso Rápido (JavaScript)

```javascript
const Ubigeoperu = require('peru-ubigeo');
const ubigeo = new Ubigeoperu();

// Obtener un listado de todos los departamentos
const regiones = ubigeo.getRegions();
console.log(regiones[0]); 
// { id: '01', name: 'Amazonas', level: 'department' }

// Buscar distritos directamente por nombre o código
const distrito = ubigeo.getDistricts('Miraflores');
console.log(distrito);
```

---

## 📘 Uso con TypeScript

La librería está 100% tipada, ofreciendo autocompletado nativo y validación en tiempo de compilación.

```typescript
import Ubigeoperu from 'peru-ubigeo';

const ubigeo = new Ubigeoperu();

const limaRegion = ubigeo.getRegions('15');

if (limaRegion && !Array.isArray(limaRegion)) {
  console.log(`Region: ${limaRegion.name}`); // Region: Lima
  
  // Extraer las provincias del departamento (Devuelve instancias de UbigeoItem)
  const provincias = limaRegion.provinces();
  
  if (provincias) {
    const limaProvincia = provincias.find(p => p.name === 'Lima');
    console.log(limaProvincia?.districts()); 
  }
}
```

---

## 📖 API de Métodos Generales

Al instanciar la clase principal, contarás con los siguientes métodos para hacer consultas globales. Todos estos métodos pueden recibir un Código numérico o un Nombre, y devolverán el `UbigeoItem` correspondiente. Si no se provee argumento, devuelven la colección completa.

### `ubigeo.getRegions([codeOrName])`
Busca un Departamento/Región. 
* Ejemplos de argumentos válidos: `'15'`, `'Lima'`, `'01'`, `'Amazonas'`.

### `ubigeo.getProvinces([codeOrName])`
Busca una Provincia. 
* Ejemplos de argumentos válidos: `'1501'`, `'Lima'`, `'0101'`, `'Chachapoyas'`.

### `ubigeo.getDistricts([codeOrName])`
Busca un Distrito. 
* Ejemplos de argumentos válidos: `'150122'`, `'Miraflores'`.

### `ubigeo.getByUbigeoCode(code)`
Retorna la instancia específica analizando la longitud del código (2 dígitos = Región, 4 dígitos = Provincia, 6 dígitos = Distrito).

---

## 🌲 Navegación en Árbol (UbigeoItem)

Todos los métodos globales devuelven objetos de tipo `UbigeoItem`. Estos objetos no solo contienen la data plana, sino que también poseen métodos para explorar hacia abajo en el árbol geográfico:

- **`doc.provinces()`**
  Solo aplicable a nivel `department`. Retorna el listado de provincias (`UbigeoItem[]`) que pertenecen a ese departamento.

- **`doc.districts()`**
  Solo aplicable a nivel `province`. Retorna el listado de distritos (`UbigeoItem[]`) que pertenecen a esa provincia.

*Ejemplo:*
```javascript
const departamento = ubigeo.getRegions('15');
const provincias = departamento.provinces();
const distritosPrimeraProv = provincias[0].districts();
```

---

## 📝 License

Este proyecto es distribuido bajo la licencia **MIT** © [Lord Dicus, amo y señor de la KOMARCA](https://github.com/Komarcalabs) y **KomarcaLabs**.
