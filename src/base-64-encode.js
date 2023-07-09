const { assert, isString } = require("@jrc03c/js-math-tools")

function base64Encode(x) {
  assert(
    isString(x),
    "The value passed into the `base64Encode` must be a string!"
  )

  return btoa(encodeURIComponent(x))
}

module.exports = base64Encode
