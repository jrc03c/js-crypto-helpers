const {
  assert,
  isNumber,
  isString,
  isUndefined,
} = require("@jrc03c/js-math-tools")

function randomString(n, charset) {
  if (isUndefined(n)) {
    n = 256
  } else {
    assert(
      isNumber(n) && Math.floor(n) === n && n > 0,
      "The first value passed into the `randomString` function must be undefined or a positive integer representing the length of the returned string! If the target length is undefined, then the default value is 256."
    )
  }

  if (isUndefined(charset)) {
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
  } else {
    assert(
      isString(charset) && charset.length > 1,
      "The second value passed into the `randomString` function must be undefined or a string representing the set of characters of which the returned string will be comprised! Note that a given character set must contain at least 2 characters in order to be secure. If the character set is undefined, then the default value is the lower- and upper-case Latin alphabet and the digits 0-9."
    )
  }

  let out = ""

  for (let i = 0; i < n; i++) {
    const index = crypto.getRandomValues(new Uint32Array(1))[0] % charset.length
    out += charset[index]
  }

  return out
}

module.exports = randomString
