// NOTE: This function was adapted from:
// - https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt#aes-gcm_2
// - https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey#pbkdf2_2

const { EncryptionError } = require("./errors")
const { isNumber, isString, isUndefined } = require("@jrc03c/js-math-tools")
const { stringify } = require("@jrc03c/js-text-tools")
const base64Encode = require("./base-64-encode")

function isNaturalNumber(x) {
  return isNumber(x) && x > 0 && parseInt(x) === x
}

async function encrypt(data, password, salt, saltLength, ivLength) {
  saltLength = isUndefined(saltLength) ? 16 : saltLength
  ivLength = isUndefined(ivLength) ? 16 : ivLength

  if (!isString(password) && password.length > 0) {
    throw new Error(
      "The second argument passed into the `encrypt` function must be a string representing the password with which the data will be encrypted!"
    )
  }

  if (!isNaturalNumber(saltLength)) {
    throw new Error(
      "The fourth argument passed into the `encrypt` function must be undefined or a natural number (i.e., a positive integer) representing the length of the new salt to be generated. If a salt is passed as the third argument of the function, however, then the fourth argument is ignored."
    )
  }

  if (!isNaturalNumber(ivLength)) {
    throw new Error(
      "The fifth argument passed into the `encrypt` function must be undefined or a natural number (i.e., a positive integer) representing the length of the initialization vector to be generated."
    )
  }

  if (!isUndefined(salt) && !(salt instanceof Uint8Array)) {
    throw new Error(
      "The third argument passed into the `encrypt` function must be undefined or a 1-dimensional Uint8Array representing the 'salt' to be used in the encryption. If you pass an undefined value as the third argument, the function will generate a new salt for you automatically. Or you could generate your own salt using something like this: `crypto.getRandomValues(new Uint8Array(12))` Importantly, use only cryptographically secure random numbers!"
    )
  }

  let out, iv

  try {
    salt = isUndefined(salt)
      ? crypto.getRandomValues(new Uint8Array(saltLength))
      : salt

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
