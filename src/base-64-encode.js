const { Base64EncodingError } = require("./errors")
const { isString } = require("@jrc03c/js-math-tools")

function base64Encode(x) {
  if (!isString(x)) {
    throw new Base64EncodingError(
      "The value passed into the `base64Encode` must be a string!"
    )
  }

  return btoa(encodeURIComponent(x))
}

module.exports = base64Encode
