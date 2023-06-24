const { isArray } = require("@jrc03c/js-math-tools")

function convertTypedArrayToObject(x) {
  if (
    x instanceof ArrayBuffer ||
    x instanceof BigInt64Array ||
    x instanceof BigUint64Array ||
    x instanceof Float32Array ||
    x instanceof Float64Array ||
    x instanceof Int16Array ||
    x instanceof Int32Array ||
    x instanceof Int8Array ||
    x instanceof Uint16Array ||
    x instanceof Uint32Array ||
    x instanceof Uint8Array ||
    x instanceof Uint8ClampedArray
  ) {
    return {
      constructor: x.constructor.name,
      flag: "FLAG_TYPED_ARRAY",
      values:
        x instanceof ArrayBuffer
          ? Array.from(new Uint8Array(x))
          : Array.from(x),
    }
  }

  if (isArray(x)) {
    return x.map(v => {
      try {
        return convertTypedArrayToObject(v)
      } catch (e) {
        return v
      }
    })
  }

  if ((typeof x === "object") & (x !== null)) {
    const out = {}

    Object.keys(x).forEach(key => {
      try {
        out[key] = convertTypedArrayToObject(x[key])
      } catch (e) {
        out[key] = x[key]
      }
    })

    return out
  }

  throw new Error(
    "The value passed into the `convertTypedArrayToObject` function must be a typed array! Valid types include: ArrayBuffer, Float32Array, Float64Array, Int16Array, Int32Array, Int8Array, Uint16Array, Uint32Array, Uint8Array, and Uint8ClampedArray."
  )
}

module.exports = convertTypedArrayToObject
