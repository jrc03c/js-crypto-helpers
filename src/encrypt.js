// NOTE: This function was adapted from:
// - https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt#aes-gcm_2
// - https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey#pbkdf2_2

const { EncryptionError } = require("./errors")
const { isString } = require("@jrc03c/js-math-tools")
const { stringify } = require("@jrc03c/js-text-tools")
const base64Encode = require("./base-64-encode")
const isNaturalNumber = require("./helpers/is-natural-number")

async function encrypt(data, password, options) {
  options = options || {}
  const saltLength = options.saltLength || 32
  const ivLength = options.ivLength || 32
  const keyIterations = options.keyIterations || 210000

  if (!isString(password) && password.length > 0) {
    throw new Error(
      "The second argument passed into the `encrypt` function must be a string representing the password with which the data will be encrypted!"
    )
  }

  if (!isNaturalNumber(saltLength)) {
    throw new Error(
      "The 'saltLength' option passed into the `encrypt` function must be undefined or a natural number (i.e., a positive integer) representing the length of the new salt to be generated."
    )
  }

  if (!isNaturalNumber(ivLength)) {
    throw new Error(
      "The 'ivLength' option passed into the `encrypt` function must be undefined or a natural number (i.e., a positive integer) representing the length of the initialization vector to be generated."
    )
  }

  if (!isNaturalNumber(keyIterations)) {
    throw new Error(
      "The 'keyIterations' option passed into the `encrypt` function must be undefined or a natural number (i.e., a positive integer) representing the number of iterations used during the key derivation."
    )
  }

  let out, salt, iv

  try {
    salt = crypto.getRandomValues(new Uint8Array(saltLength))

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    )

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: keyIterations,
        hash: "SHA-512",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    )

    iv = crypto.getRandomValues(new Uint8Array(ivLength))

    out = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      new TextEncoder().encode(stringify(data))
    )
  } catch (e) {
    throw new EncryptionError(e.toString())
  }

  return base64Encode(
    stringify({
      salt: salt,
      iv: iv,
      value: out,
    })
  )
}

module.exports = encrypt
