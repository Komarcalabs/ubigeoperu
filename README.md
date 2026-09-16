<div align="center">
  
# 🇵🇪 Peru Ubigeo

**Librería simple, moderna y actualizada para consultar códigos de ubigeo del Perú**

[![NPM Version](https://badge.fury.io/js/peru-ubigeo.svg)](https://npmjs.org/package/peru-ubigeo)
[![Build Status](https://github.com/Komarcalabs/ubigeoperu/actions/workflows/ci.yml/badge.svg)](https://github.com/Komarcalabs/ubigeoperu/actions/workflows/ci.yml)
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

## 🗺️ ¿Qué es el Ubigeo y cómo se compone?

El **Ubigeo** (Ubicación Geográfica) es un código numérico oficial de 6 dígitos creado por el INEI en el Perú para identificar a cada unidad política-administrativa del país. 

El código se divide jerárquicamente en **3 bloques de 2 dígitos cada uno**:

| Bloque | Significado | Ejemplo |
| :---: | :--- | :--- |
| **`01`** | **Departamento / Región** (Primeros 2 dígitos) | `15` representa a Lima |
| **`01`** | **Provincia** (Cuatro primeros dígitos) | `1501` representa la Provincia de Lima |
| **`01`** | **Distrito** (Todos los 6 dígitos) | `150101` representa el distrito Cercado de Lima |

Al utilizar esta librería, los métodos están diseñados para entender nativamente esta composición. Es decir, si pides un Departamento (`getRegions`), solo necesitarás proveer un código de 2 dígitos.

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

// Buscar distritos directamente por nombre
const distrito = ubigeo.getDistricts('Miraflores');
console.log(distrito);
// { id: '150122', name: 'Miraflores', level: 'district' }
```

---

## 📖 API de Métodos Generales

Al instanciar la clase principal (`const ubigeo = new Ubigeoperu()`), contarás con múltiples métodos para realizar búsquedas globales rápidas. 

> [!NOTE]  
> Todos estos métodos pueden recibir un **Nombre**, un **Código numérico**, o ejecutarse **sin argumentos** para devolver la colección completa.

### `ubigeo.getRegions([codeOrName])`
Busca un Departamento/Región. 

```javascript
// 1. Sin argumentos (Retorna todos los departamentos del Perú)
const todos = ubigeo.getRegions(); 

// 2. Buscar por Código (2 dígitos)
const lima = ubigeo.getRegions('15');

// 3. Buscar por Nombre
const amazonas = ubigeo.getRegions('Amazonas');

console.log(amazonas); 
// -> { id: '01', name: 'Amazonas', level: 'department' }
```

### `ubigeo.getProvinces([codeOrName])`
Busca una Provincia.

```javascript
// Buscar por Código (4 dígitos)
const provLima = ubigeo.getProvinces('1501');

// Buscar por Nombre
const chachapoyas = ubigeo.getProvinces('Chachapoyas');

console.log(chachapoyas); 
// -> { id: '0101', name: 'Chachapoyas', level: 'province' }
```

### `ubigeo.getDistricts([codeOrName])`
Busca un Distrito.

```javascript
// Buscar por Código (6 dígitos)
const miraflores = ubigeo.getDistricts('150122');

// Buscar por Nombre
const sanIsidro = ubigeo.getDistricts('San Isidro');

console.log(sanIsidro); 
// -> { id: '150131', name: 'San Isidro', level: 'district' }
```

### `ubigeo.getByUbigeoCode(code)`
Este es un **método mágico y dinámico**. Analiza automáticamente la longitud del código para deducir qué necesitas de acuerdo a las reglas oficiales del Ubigeo:

- `2 dígitos` -> Retorna un Departamento.
- `4 dígitos` -> Retorna una Provincia.
- `6 dígitos` -> Retorna un Distrito.

```javascript
const region    = ubigeo.getByUbigeoCode('01');      // Devuelve Amazonas (Departamento)
const provincia = ubigeo.getByUbigeoCode('0101');    // Devuelve Chachapoyas (Provincia)
const distrito  = ubigeo.getByUbigeoCode('010119');  // Devuelve San Isidro de Maino (Distrito)
```

---

## 🌲 Navegación en Árbol (Jerarquía)

A veces no quieres buscar toda la información geográficamente suelta, sino que prefieres bajar de nivel progresivamente. Todos los métodos globales devuelven objetos de tipo `UbigeoItem`. Estos objetos poseen métodos para **explorar hacia abajo** en el árbol geográfico:

- **`doc.provinces()`**
  Solo aplicable a nivel `department`. Retorna el listado de provincias que pertenecen a ese departamento.

- **`doc.districts()`**
  Solo aplicable a nivel `province`. Retorna el listado de distritos que pertenecen a esa provincia.

*Ejemplo de uso:*
```javascript
// Paso 1: Traemos un departamento (ej. Lima = '15')
const departamento = ubigeo.getRegions('15');

// Paso 2: Extraemos solo las provincias pertenecientes a Lima
const provincias = departamento.provinces();

// Paso 3: Usamos la primera provincia (Lima) para extraer sus distritos
const distritosPrimeraProv = provincias[0].districts();

console.log(distritosPrimeraProv[0].name); // "Lima"
```

---

## 📘 Uso con TypeScript

La librería está 100% tipada, ofreciendo autocompletado nativo y validación en tiempo de compilación para que no cometas errores de tipo de dato.

```typescript
import Ubigeoperu from 'peru-ubigeo';

const ubigeo = new Ubigeoperu();

const limaRegion = ubigeo.getRegions('15');

if (limaRegion && !Array.isArray(limaRegion)) {
  console.log(`Region: ${limaRegion.name}`); // Region: Lima
  
  // TypeScript sabrá exactamente que 'provincias' es un arreglo de UbigeoItem
  const provincias = limaRegion.provinces();
  
  if (provincias) {
    const limaProvincia = provincias.find(p => p.name === 'Lima');
    console.log(limaProvincia?.districts()); 
  }
}
```

---

## 📝 License

Este proyecto es distribuido bajo la licencia **MIT** © [Lord Dicus, amo y señor de la KOMARCA](https://github.com/Komarcalabs) y **KomarcaLabs**.
