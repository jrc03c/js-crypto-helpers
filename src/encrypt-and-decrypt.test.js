// eslint-disable-next-line no-unused-vars
const crypto = require("node:crypto")
const decrypt = require("./decrypt")
const encrypt = require("./encrypt")
jest.setTimeout(60000)

test("tests that data can be encrypted and decrypted correctly", async () => {
  const text = "Hello, world!"
  const password = "$3cret!"

  const encrypted = await encrypt(text, password)
  expect(encrypted).not.toBe(text)
  expect(encrypted).not.toBe(password)

  let failed = false

  try {
    const wrongPassword = "Wrong password!"
    await decrypt(encrypted, wrongPassword)
  } catch (e) {
    failed = true
  }

  expect(failed).toBe(true)

  const decrypted = await decrypt(encrypted, password)
  expect(decrypted).toBe(text)
  expect(decrypted).not.toBe(encrypted)
  expect(decrypted).not.toBe(password)

  const variables = [
    0,
    1,
    2.3,
    -2.3,
    Infinity,
    -Infinity,
    NaN,
    true,
    false,
    null,
    undefined,
    Symbol.for("Hello, world!"),
    [2, 3, 4],
    [
      [2, 3, 4],
      [5, 6, 7],
    ],
    x => x,
    function (x) {
      return x
    },
    { hello: "world" },
  ]

  for (const v1 of variables) {
    for (const v2 of variables) {
      let failed = false

      try {
        await decrypt(await encrypt(v1, v2), v2)
      } catch (e) {
        failed = true
      }

      expect(failed).toBe(true)
    }
  }
})
