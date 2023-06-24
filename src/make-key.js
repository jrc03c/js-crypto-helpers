// NOTE: This is NOT currently cryptographically secure, but it needs to be made
// to be!

const {
  assert,
  floor,
  isNumber,
  isString,
  isUndefined,
  random,
  seed,
} = require("@jrc03c/js-math-tools")

function makeKey(n, s, charset) {
  assert(
    isNumber(n) && n >= 0 && floor(n) === n,
    "The first argument passed into the `makeKey` function must be a whole number representing the length of the string to be returned!"
  )

  if (arguments.length > 1) {
    if (isString(arguments[1])) {
      charset = s
      s = undefined
    }
  }

  assert(
    isUndefined(s) || isNumber(s),
    "The second argument passed into the `makeKey` function, if used, must be a number representing a seed to be passed to the PRNG!"
  )

  assert(
    isUndefined(charset) || isString(charset),
    "The third argument passed into the `makeKey` function, if used, must be a string representing a set of characters from which the returned string will be constructed!"
  )

  if (typeof s !== "undefined") {
    seed(s)
  }

  const letters = "abcdefghijklmnopqrstuvwxyz"
  const numbers = "0123456789"
  let out = ""

  for (let i = 0; i < n; i++) {
    if (charset) {
      out += charset[floor(random() * charset.length)]
    } else {
      if (random() < 0.5) {
        out += letters[floor(random() * letters.length)]
      } else {
        out += numbers[floor(random() * numbers.length)]
      }
    }
  }

  return out
}

module.exports = makeKey
