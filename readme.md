# Intro

This library just provides a few thin wrappers around core JS `crypto` functions with sane defaults. I mostly adapted these functions from the following MDN articles:

- [`crypto.subtle.encrypt` : AES-GCM](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt#aes-gcm_2)
- [`crypto.subtle.deriveKey` : PBKDF2](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey#pbkdf2_2)
- [`crypto.subtle.digest`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)

> **DISCLAIMER:** I am _not_ a cryptography professional. Use at your own risk!

# Installation

In Node / bundlers:

```bash
npm install --save @jrc03c/js-crypto-helpers
```

Or in the browser with a CDN:

```html
<script src="https://unpkg.com/@jrc03c/js-crypto-helpers/dist/js-crypto-helpers.js"></script>
```

# Usage

```js
const { encrypt, decrypt, hash } = require("@jrc03c/js-crypto-helpers")

encrypt("My secret text", "p455w0rd!").then(result => {
  console.log(result)
  // {
  //   salt: Uint8Array(16) [
  //     195, 155, 101, 182, 202,
  //     164, 202,  10,  16, 148,
  //     156,   8, 142, 133, 109,
  //     76
  //   ],
  //   iv: Uint8Array(16) [
  //     99, 209, 115, 208, 54,  77,
  //     246, 155,  47,  19,  3, 158,
  //     156,  89, 205, 124
  //   ],
  //   value: ArrayBuffer {
  //     [Uint8Contents]: <69 c6 04 bf e5 25 d1 2a 14 28 c9 25 4f 9e a6 e9 bb 85 92 5c 30 a0 db f3 04 ea a0 45 fe 3b 80 8d>,
  //     byteLength: 32
  //   }
  // }

  decrypt(result, "p455w0rd!").then(orig => {
    console.log(orig)
    // "My secret text"
  })
})

hash("someone@example.com").then(result => {
  console.log(result)
  // a4dcddc4e706799ef4fcd15119077f072804fe679f64008be00b720621900b504ee99976446867865544f4384d0454448ac7d6232a2073389c5b8d43ce4b5ec5
})
```

# API

## `decrypt`

Parameters:

- `data` = An object of the type returned by the `encrypt` function.
- `password` = A string.

Returns a `Promise` that resolves to a string representing the original, decrypted value.

Example:

```js
const { decrypt, encrypt } = require("@jrc03c/js-crypto-helpers")

encrypt("My secret text", "p455w0rd!").then(async data => {
  console.log(await decrypt(data, "p455w0rd!"))
  // My secret text
})
```

## `encrypt`

Parameters:

- `value` = A value to be encrypted. Note that this value can be of any type, not just strings! The only caveat is that objects instantiated from specific classes will not be decrypted back into their original instance form; instead, they'll be returned as plain JS objects. For example, if you create a class called `Foo`, create an instance of that class called `foo`, encrypt that instance, and then decrypt it again later, it will probably still have most of the visible properties of `foo`, but it will no longer be an instance of the `Foo` class.
- `password` = A string.
- `salt` (optional) = A one-dimensional `UInt8Array`. The default value is undefined.
- `saltLength` (optional) = A positive integer representing the length of the salt to be generated. If `salt` is passed as well, then `saltLength` is ignored. The default value is 16.
- `ivLength` (optional) = A positive integer representing the length of the initialization vector to be generated. The default value is 16.

Returns a `Promise` that resolves to an object with properties `salt`, `iv`, and `value`. If you want to store this object to disk, I recommend using the combination of the `stringify` and `parse` functions in this library. They handle JS typed arrays automatically, which is useful because the `salt`, `iv`, and `value` properties have values that are a `UInt8Array`, a `UInt8Array`, and an `ArrayBuffer` respectively. The built-in `JSON.stringify` function can handle `UInt8Array` values but not `ArrayBuffer` values (or so it seems).

Example:

```js
const { decrypt, encrypt } = require("@jrc03c/js-crypto-helpers")

encrypt("My secret text", "p455w0rd!").then(async data => {
  console.log(await decrypt(data, "p455w0rd!"))
  // My secret text
})
```

## `hash`

Parameters:

- `value` = A value to be hashed. Note that this value can be of any type, not just strings! Non-string values are converted to strings using this library's `stringify` function.
- `salt` = A string to be added to `value` before hashing.

Returns a `Promise` that resolves to a string.

Example:

```js
const { hash } = require("@jrc03c/js-crypto-helpers")

// without salt
hash("Hello, world!").then(console.log)
// f716fb41b25d366c6a3b86c3c04aad45500416fb56223dc56aa3ced1e775e15717f57f80a619067df61d7751a17e0d549979a32a079b9596ff79d9e856acb3ef

// with salt
hash("Hello, world!", "This is a salt!").then(console.log)
// fb355ba9f91f56836ae8b05fcae647f34073eb41cc63044d73fc101020a25a1a50045d9363fbbc1d97683da00eecdd6f06f994c4837f2349688292053e07d369

// with salt added to the original value instead of being passed as an argument
hash("Hello, world!" + "This is a salt!").then(console.log)
// fb355ba9f91f56836ae8b05fcae647f34073eb41cc63044d73fc101020a25a1a50045d9363fbbc1d97683da00eecdd6f06f994c4837f2349688292053e07d369
```

## `parse`

Parameters:

- `value` = A string value to be parsed.

Returns a value of whatever type the stringified value represented.

Technically speaking, this function is just re-exported from the [@jrc03c/js-text-tools](https://github.com/jrc03c/js-text-tools) library without any modification. See the source code there for implementation details.

Note that this function is designed to be paired with the `stringify` function in this library, especially when attempting to stringify typed arrays (e.g., `UInt8Array`, `ArrayBuffer`, etc.). Generally speaking, it functions much like `JSON.parse` except that it adds support for a few extra edge cases.

Example:

```js
const { parse, stringify } = require("@jrc03c/js-crypto-helpers")
const s = stringify({ hello: "world" })
const orig = parse(s)
console.log(orig, typeof orig)
// { hello: 'world' } object
```

## `randomString`

Parameters:

- `length` = A non-negative integer representing the length of the string to be returned.
- `charset` (optional) = A string containing the characters that should make up the returned string.

Returns a string.

Example:

```js
const { randomString } = require("@jrc03c/js-crypto-helpers")

console.log(randomString(32))
// y3Qotz5cZZYdXGCuyZB2SymSmr6t5kmo

console.log(randomString(32, "foo"))
// oofoofoffooofofofoofoffoffooooff
```

## `stringify`

Parameters:

- `value` = A value to be stringified.
- `indentation` (optional) = A string used to indent each line in the returned string. If not passed, the returned string won't contain any line breaks or indentation (except, of course, where strings already inside the object contain line breaks and indentations). This parameter is very similar to the third argument passed into `JSON.stringify` (e.g., `JSON.stringify(myObject, null, 2)`) except that `indentation` in this implementation can be any characters, not just spaces. Of course, that opens up the possibility of creating invalid JSON, but I'm not too worried about that.

Returns a string.

Technically speaking, this function is just re-exported from the [@jrc03c/js-text-tools](https://github.com/jrc03c/js-text-tools) library without any modification. See the source code there for implementation details.

> **NOTE:** This function will destroy any circular references that exist in objects.

Example:

```js
const { stringify } = require("@jrc03c/js-crypto-helpers")
const object = { hello: "world" }
const indentation = "  "

// without indentation
console.log(stringify(object))
// {"hello":"world"}

// with indentation
console.log(stringify(object, indentation))
// {
//   "hello": "world"
// }
```
