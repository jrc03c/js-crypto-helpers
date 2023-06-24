const hash = require("./hash")
const makeKey = require("@jrc03c/make-key")
const stringify = require("./stringify")

async function hashWithSalt(x, saltLength) {
  if (typeof saltLength === "undefined") {
    saltLength = 256
  }

  if (
    typeof saltLength !== "number" ||
    saltLength <= 0 ||
    parseInt(saltLength) !== saltLength
  ) {
    throw new Error(
      "The second argument passed into the `hashWithSalt` function must be a natural number (i.e., a positive integer) representing the length of the salt to be generated!"
    )
  }

  const salt = makeKey(saltLength)

  return {
    value: await hash(stringify(x) + salt),
    salt,
  }
}

module.exports = hashWithSalt
