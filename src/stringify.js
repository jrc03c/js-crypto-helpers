const { decycle } = require("@jrc03c/js-math-tools")
const convertTypedArrayToObject = require("./convert-typed-array-to-object")

function stringify(x) {
  if (typeof x === "undefined") {
    return "undefined"
  }

  if (typeof x === "string") {
    return x
  }

  if (typeof x === "symbol") {
    return x.toString()
  }

  if (typeof x === "function") {
    return `[Function ${x.name}]`
  }

  if (typeof x === "number") {
    if (x === Infinity) {
      return "Infinity"
    }

    if (x === -Infinity) {
      return "-Infinity"
    }

    if (isNaN(x)) {
      return "NaN"
    }
  }

  try {
    return JSON.stringify(convertTypedArrayToObject(decycle(x)))
  } catch (e) {
    // ...
  }

  try {
    if (typeof x === "object") {
      if (x === null) {
        return "null"
      }

      if (x instanceof Array) {
        return JSON.stringify(
          x.map(v => {
            try {
              return convertTypedArrayToObject(v)
            } catch (e) {
              return v
            }
          })
        )
      }

      const out = {}

      Object.keys(x).forEach(key => {
        try {
          out[key] = convertTypedArrayToObject(x[key])
        } catch (e) {
          out[key] = x[key]
        }
      })

      return JSON.stringify(out)
    }

    return JSON.stringify(x)
  } catch (e) {
    try {
      return stringify(decycle(x))
    } catch (e) {
      // ...
    }

    return x.toString()
  }
}

module.exports = stringify
