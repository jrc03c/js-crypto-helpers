const { isArray } = require("@jrc03c/js-math-tools")

const context =
  typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
    ? global
    : typeof self !== "undefined"
    ? self
    : undefined

function convertObjectToTypedArray(x) {
  if ("flag" in x && x.flag === "FLAG_TYPED_ARRAY") {
    if (!("values" in x) || !("constructor" in x)) {
      throw new Error(
        "The value passed into the `convertObjectToTypedArray` must have 'constructor' and 'values' properties!"
      )
    }

    if (x.constructor === "ArrayBuffer") {
      return new Uint8Array(x.values).buffer
    }

    return new context[x.constructor](x.values)
  }

  if (isArray(x) && x.constructor.name === "Array") {
    return x
  }

  throw new Error(
    "The value passed into the `convertObjectToTypedArray` must be an object that can be converted into a typed array!"
  )
}

module.exports = convertObjectToTypedArray
