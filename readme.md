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
  // {"salt":{"constructor":"Uint8Array","flag":"FLAG_TYPED_ARRAY","values":[25,106,137,44,224,191,69,117,22,153,94,70,172,68,214,204]},"iv":{"constructor":"Uint8Array","flag":"FLAG_TYPED_ARRAY","values":[34,180,253,129,168,175,53,220,5,99,149,118,153,130,118,71]},"value":{"constructor":"ArrayBuffer","flag":"FLAG_TYPED_ARRAY","values":[45,54,83,15,249,104,90,126,21,70,31,185,131,113,77,136,165,0,142,149,218,107,20,61,173,140,150,231,2,20,132,26]}}

  decrypt(result, "p455w0rd!").then(orig => {
    console.log(orig)
    // "My secret text"
  })
})

hash("someone@example.com").then(result => {
  console.log(result)
  // 22da9c986e9ea81edb1d9f476650d05790425cad633328aed7a4cf9469c567b7e5bec44bb61575c0a0235eb6516490c601d20fada8bc35feec672bbd875a839f
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

Returns a `Promise` that resolves to a string.

Example:

```js
const { hash } = require("@jrc03c/js-crypto-helpers")
hash("Hello, world!").then(console.log)
// f716fb41b25d366c6a3b86c3c04aad45500416fb56223dc56aa3ced1e775e15717f57f80a619067df61d7751a17e0d549979a32a079b9596ff79d9e856acb3ef
```

## `hashWithSalt`

Parameters:

- `value` = A value to be hashed. Note that this value can be of any type, not just strings! Non-string values are converted to strings using this library's `stringify` function.
- `saltLength` (optional) = A positive integer representing the length of the salt value to be generated. The default value is 256.

Returns a `Promise` that resolves to an object with these properties:

- `value` = The string result of the hashing process.
- `salt` = The generated string that was appended to the stringified input value before it was hashed.

Example:

```js
const { hashWithSalt } = require("@jrc03c/js-crypto-helpers")
hashWithSalt("Hello, world!", 32).then(console.log)
// {
//   value: '1f25c72c8c3ddf66c87fcb1f653f522065e7d8ae3f491b699e39bd2e304b5006b1c0cae462dd94e6bc726a222ac94539fd8d53af234e5c3e3ede4f4b8a56359a',
//   salt: 't09go0gyxt7238a8983jsc4ep997d9hn'
// }
```

## `makeKey`

Parameters:

- `length` = A non-negative integer representing the length of the string to be returned.
- `seed` (optional) = A number with which to seed the PRNG.
- `charset` (optional) = A string containing the characters that should make up the returned string.

Returns a string.

> **NOTE:** This function is **NOT** currently cryptographically secure! My next major change will be to make it secure, but I haven't gotten to it yet.

Example:

```js
const { makeKey } = require("@jrc03c/js-crypto-helpers")

console.log(makeKey(32))
// ks7942zscvl0o03p4w18ag92nu81s505
// ☝️ your computer will likely generate a different value than the one above

console.log(makeKey(32, 12345))
// eqkq50959b4jg8y5a12i54o704t2ei9k
// ☝️ your computer should generate exactly the same value as the one above,
// assuming you use the same length and seed value!
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

# To-do

- Make the `makeKey` function cryptographically secure.
