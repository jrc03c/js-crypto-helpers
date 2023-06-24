const { stringify } = require("@jrc03c/js-text-tools")

// adapted from: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
async function hash(x) {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest(
        "SHA-512",
        new TextEncoder().encode(stringify(x))
      )
    )
  )
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
}

module.exports = hash
