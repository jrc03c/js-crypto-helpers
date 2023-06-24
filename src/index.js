const JSCryptoHelpers = {
  convertObjectToTypedArray: require("./convert-object-to-typed-array"),
  convertTypedArrayToObject: require("./convert-typed-array-to-object"),
  decrypt: require("./decrypt"),
  encrypt: require("./encrypt"),
  hash: require("./hash"),
  hashWithSalt: require("./hash-with-salt"),
  makeKey: require("./make-key"),
  parse: require("./parse"),
  stringify: require("./stringify"),

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
