const { Base64DecodingError } = require("./errors")
const { isString } = require("@jrc03c/js-math-tools")

function base64Decode(x) {
  if (!isString(x)) {
    throw new Error(
      "The value passed into the `base64Decode` must be a string!"
    )
  }

  try {
    return decodeURIComponent(atob(x))
  } catch (e) {
    throw new Base64DecodingError(e.toString())
  }
}

module.exports = base64Decode
