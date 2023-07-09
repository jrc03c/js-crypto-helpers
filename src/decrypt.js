// NOTE: This function was adapted from:
// - https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt#aes-gcm_2
// - https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey#pbkdf2_2

const { assert, isString } = require("@jrc03c/js-math-tools")
const { parse } = require("@jrc03c/js-text-tools")
const base64Decode = require("./base-64-decode")

async function decrypt(data, password) {
  assert(
    isString(data),
    "The first argument passed into the `decrypt` function must be a string (i.e., the same string returned from the `encrypt` function)!"
  )

  assert(
    isString(password) && password.length > 0,
    "The second argument passed into the `decrypt` function must be a string representing the password with which to decrypt the encrypted data."
  )

  data = parse(base64Decode(data))

  let { iv, salt, value } = data

  assert(
    iv && salt && value,
    "The first argument passed into the `decrypt` function must be an object with properties 'iv', 'salt', and 'value' (i.e., the same object returned from the `encrypt` function)!"
  )

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
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  )

  let out = new TextDecoder().decode(
    await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, value)
  )

  try {
    return parse(out)
  } catch (e) {
    return out
  }
}

module.exports = decrypt
