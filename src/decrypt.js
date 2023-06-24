// NOTE: This function was adapted from:
// - https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt#aes-gcm_2
// - https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey#pbkdf2_2

const { isObject, isString } = require("@jrc03c/js-math-tools")
const { parse } = require("@jrc03c/js-text-tools")

async function decrypt(data, password) {
  if (!isObject(data)) {
    throw new Error(
      "The first argument passed into the `decrypt` function must be an object with properties 'iv', 'salt', and 'value' (i.e., the same object returned from the `encrypt` function)!"
    )
  }

  if (!isString(password) || password.length === 0) {
    throw new Error(
      "The second argument passed into the `decrypt` function must be a string representing the password with which to decrypt the encrypted data."
    )
  }

  let { iv, salt, value } = data

  if (!iv || !salt || !value) {
    throw new Error(
      "The first argument passed into the `decrypt` function must be an object with properties 'iv', 'salt', and 'value' (i.e., the same object returned from the `encrypt` function)!"
    )
  }

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
