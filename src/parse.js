const convertObjectToTypedArray = require("./convert-object-to-typed-array")

function parse(x) {
  try {
    if (typeof x === "string") {
      if (x === "Infinity") {
        return Infinity
      }

      if (x === "-Infinity") {
        return -Infinity
      }

      if (x === "NaN") {
        return NaN
      }

      if (x === "undefined") {
        return undefined
      }

      if (x.match(/^Symbol\(.*?\)$/g)) {
        x = x.replace("Symbol(", "")
        x = x.substring(0, x.length - 1)
        return Symbol.for(x)
      }
    }

    return JSON.parse(x, function (key, value) {
      try {
        return convertObjectToTypedArray(value)
      } catch (e) {
        return value
      }
    })
  } catch (e) {
    return x
  }
}

module.exports = parse
