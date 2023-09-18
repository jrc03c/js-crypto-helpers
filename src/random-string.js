const { isString, isUndefined } = require("@jrc03c/js-math-tools")
const { RandomStringGenerationError } = require("./errors")
const isNaturalNumber = require("./helpers/is-natural-number")

function randomString(n, charset) {
  if (isUndefined(n)) {
    n = 256
  } else {
    if (!isNaturalNumber(n)) {
      throw new Error(
        "The first value passed into the `randomString` function must be undefined or a positive integer representing the length of the returned string! If no length is passed, then the default length will be 256."
      )
    }
  }

  if (isUndefined(charset)) {
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
  } else {
    if (!isString(charset) || charset.length <= 1) {
      throw new Error(
        "The second value passed into the `randomString` function must be undefined or a string representing the set of characters of which the returned string will be comprised! Note that a given character set must contain at least 2 characters in order to be secure. If the character set is undefined, then the default value is the lower- and upper-case Latin alphabet and the digits 0-9."
      )
    }
  }

  try {
    let out = ""

    for (let i = 0; i < n; i++) {
      const index =
        crypto.getRandomValues(new Uint32Array(1))[0] % charset.length
      out += charset[index]
    }

    return out
  } catch (e) {
    throw new RandomStringGenerationError(e.toString())
  }
}

module.exports = randomString
