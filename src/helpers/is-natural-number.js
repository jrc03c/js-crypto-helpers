const { isNumber } = require("@jrc03c/js-math-tools")

function isNaturalNumber(x) {
  return isNumber(x) && x > 0 && parseInt(x) === x
}

module.exports = isNaturalNumber
