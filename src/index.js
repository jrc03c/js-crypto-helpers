const { parse, stringify } = require("@jrc03c/js-text-tools")

const JSCryptoHelpers = {
  decrypt: require("./decrypt"),
  encrypt: require("./encrypt"),
  hash: require("./hash"),
  hashWithSalt: require("./hash-with-salt"),
  makeKey: require("./make-key"),
  parse,
  stringify,

  dump() {
    Object.keys(JSCryptoHelpers)
      .filter(key => key !== "dump")
      .forEach(key => {
        globalThis[key] = JSCryptoHelpers[key]
      })
  },
}

if (typeof module !== "undefined") {
  module.exports = JSCryptoHelpers
}

if (typeof globalThis !== "undefined") {
  globalThis.JSCryptoHelpers = JSCryptoHelpers
}
