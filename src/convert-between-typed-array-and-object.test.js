const { abs, isEqual, normal, round } = require("@jrc03c/js-math-tools")
const convertObjectToTypedArray = require("./convert-object-to-typed-array")
const convertTypedArrayToObject = require("./convert-typed-array-to-object")

test("tests that the `convertTypedArrayToObject` works correctly", () => {
  const types = {
    Array,
    BigInt64Array,
    BigUint64Array,
    Float32Array,
    Float64Array,
    Int16Array,
    Int32Array,
    Int8Array,
    Uint16Array,
    Uint32Array,
    Uint8Array,
    Uint8ClampedArray,
  }

  Object.keys(types).forEach(type => {
    const lowerType = type.toLowerCase()

    const values = normal(100).map(v => {
      if (lowerType.includes("int")) {
        v = round(v)
      }

      if (lowerType.includes("uint")) {
        v = abs(v)
      }

      if (lowerType.includes("bigint") || lowerType.includes("biguint")) {
        v = BigInt(v)
      }

      return v
    })

    const x = type === "Array" ? values : new types[type](values)

    const yTrue =
      type === "Array"
        ? Array.from(x)
        : {
            constructor: type,
            flag: "FLAG_TYPED_ARRAY",
            values: Array.from(x),
          }

    const yPred = convertTypedArrayToObject(x)
    expect(isEqual(yTrue, yPred)).toBe(true)
  })
})

test("tests that the `convertObjectToTypedArray` works correctly", () => {
  const types = {
    Array,
    BigInt64Array,
    BigUint64Array,
    Float32Array,
    Float64Array,
    Int16Array,
    Int32Array,
    Int8Array,
    Uint16Array,
    Uint32Array,
    Uint8Array,
    Uint8ClampedArray,
  }

  Object.keys(types).forEach(type => {
    const lowerType = type.toLowerCase()

    const x = {
      constructor: type,
      flag: "FLAG_TYPED_ARRAY",
      values: normal(100).map(v => {
        if (lowerType.includes("int")) {
          v = round(v)
        }

        if (lowerType.includes("uint")) {
          v = abs(v)
        }

        if (lowerType.includes("bigint") || lowerType.includes("biguint")) {
          v = BigInt(v)
        }

        return v
      }),
    }

    const yTrue = new types[type](x.values)
    const yPred = convertObjectToTypedArray(x)
    expect(isEqual(yTrue, yPred)).toBe(true)
    expect(yTrue.constructor.name).toBe(type)
    expect(yPred.constructor.name).toBe(type)
  })

  const a = {
    constructor: "ArrayBuffer",
    flag: "FLAG_TYPED_ARRAY",
    values: [2, 3, 4],
  }

  const bTrue = new Uint8Array([2, 3, 4]).buffer
  const bPred = convertObjectToTypedArray(a)
  expect(isEqual(bTrue, bPred)).toBe(true)
  expect(bPred.constructor.name).toBe(bTrue.constructor.name)

  const c = { constructor: a.constructor, values: a.values }
  const d = { constructor: a.constructor, flag: a.flag }
  const e = { flag: a.flag, values: a.values }
  const wrongs = [c, d, e]

  wrongs.forEach(wrong => {
    expect(() => convertObjectToTypedArray(wrong)).toThrow()
  })
})

test("tests that typed arrays can be converted to objects and back", () => {
  const types = {
    Array,
    BigInt64Array,
    BigUint64Array,
    Float32Array,
    Float64Array,
    Int16Array,
    Int32Array,
    Int8Array,
    Uint16Array,
    Uint32Array,
    Uint8Array,
    Uint8ClampedArray,
  }

  Object.keys(types).forEach(type => {
    const lowerType = type.toLowerCase()

    const values = normal(100).map(v => {
      if (lowerType.includes("int")) {
        v = round(v)
      }

      if (lowerType.includes("uint")) {
        v = abs(v)
      }

      if (lowerType.includes("bigint") || lowerType.includes("biguint")) {
        v = BigInt(v)
      }

      return v
    })

    const xTrue = new types[type](values)
    const xPred = convertObjectToTypedArray(convertTypedArrayToObject(xTrue))
    expect(isEqual(xTrue, xPred)).toBe(true)
    expect(xTrue.constructor.name).toBe(type)
    expect(xPred.constructor.name).toBe(type)
  })
})
