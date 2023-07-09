const { assert, isString } = require("@jrc03c/js-math-tools")

function base64Decode(x) {
  assert(
    isString(x),
    "The value passed into the `base64Decode` must be a string!"
  )

  return decodeURIComponent(atob(x))
}

module.exports = base64Decode
