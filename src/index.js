const { parse, stringify } = require("@jrc03c/js-text-tools")

const JSCryptoHelpers = {
  base64Decode: require("./base-64-decode"),
  base64Encode: require("./base-64-encode"),
  decrypt: require("./decrypt"),
  encrypt: require("./encrypt"),
  hash: require("./hash"),
  parse,
  randomString: require("./random-string"),
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
