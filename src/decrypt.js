// NOTE: This function was adapted from:
// - https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt#aes-gcm_2
// - https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey#pbkdf2_2

const { DecryptionError } = require("./errors")
const { isString } = require("@jrc03c/js-math-tools")
const { parse } = require("@jrc03c/js-text-tools")
const base64Decode = require("./base-64-decode")
const isNaturalNumber = require("./helpers/is-natural-number")

async function decrypt(data, password, options) {
  options = options || {}
  const keyIterations = options.keyIterations || 210000

  if (!isString(data)) {
    throw new Error(
      "The first argument passed into the `decrypt` function must be a string (i.e., the same string returned from the `encrypt` function)!"
    )
  }

  if (!isString(password) || password.length === 0) {
    throw new Error(
      "The second argument passed into the `decrypt` function must be a string representing the password with which to decrypt the encrypted data."
    )
  }

  if (!isNaturalNumber(keyIterations)) {
    throw new Error(
      "The 'keyIterations' option passed into the `decrypt` function must be undefined or a natural number (i.e., a positive integer) representing the number of iterations used during the key derivation. NOTE: For decryption to be successful, this number must match the number of iterations that was used during the encryption of the data."
    )
  }

  data = parse(base64Decode(data))

  let { iv, salt, value } = data

  if (!iv || !salt || !value) {
    throw new Error(
      "The first argument passed into the `decrypt` function must be an object with properties 'iv', 'salt', and 'value' (i.e., the same object returned from the `encrypt` function)!"
    )
  }

  let out, key

  try {
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    )

    key = await crypto.subtle.deriveKey(
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
  } catch (e) {
    throw new DecryptionError(e.toString())
  }

  try {
    out = new TextDecoder().decode(
      await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, value)
    )
  } catch (e) {
    throw new DecryptionError("Invalid password!")
  }

  try {
    return parse(out)
  } catch (e) {
    return out
  }
}

module.exports = decrypt
