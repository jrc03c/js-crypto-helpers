const decrypt = require("./decrypt")
const encrypt = require("./encrypt")
const randomString = require("./random-string")
jest.setTimeout(999999999)

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

  for (const v of variables) {
    const pass = randomString()
    const e = await encrypt(v, pass)
    let failed = false

    try {
      await decrypt(e, pass)
    } catch (e) {
      failed = true
    }

    expect(failed).toBe(false)
  }

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

  // right and wrong argument types
  const rightSalt = new Uint8Array([1, 2, 3, 4, 5])

  await (async () => {
    let failed = false

    try {
      await encrypt("hello", "world", { salt: rightSalt })
    } catch (e) {
      failed = true
    }

    expect(failed).toBe(false)
  })()

  const rightSaltLength = 16

  await (async () => {
    let failed = false

    try {
      await encrypt("hello", "world", { saltLength: rightSaltLength })
    } catch (e) {
      failed = true
    }

    expect(failed).toBe(false)
  })()

  const wrongSaltLengths = [
    2.3,
    -2.3,
    Infinity,
    -Infinity,
    "foo",
    true,
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
    new Date(),
  ]

  for (const saltLength of wrongSaltLengths) {
    let failed = false

    try {
      await encrypt("hello", "world", { saltLength })
    } catch (e) {
      failed = true
    }

    expect(failed).toBe(true)
  }

  const rightIvLength = 16

  await (async () => {
    let failed = false

    try {
      await encrypt("hello", "world", { ivLength: rightIvLength })
    } catch (e) {
      failed = true
    }

    expect(failed).toBe(false)
  })()

  const wrongIvLengths = [
    2.3,
    -2.3,
    Infinity,
    -Infinity,
    "foo",
    true,
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
    new Date(),
  ]

  for (const ivLength of wrongIvLengths) {
    let failed = false

    try {
      await encrypt("hello", "world", { ivLength })
    } catch (e) {
      failed = true
    }

    expect(failed).toBe(true)
  }

  const rightKeyIterations = 128

  await (async () => {
    let failed = false

    try {
      await encrypt("hello", "world", { keyIterations: rightKeyIterations })
    } catch (e) {
      failed = true
    }

    expect(failed).toBe(false)
  })()

  const wrongKeyIterations = [
    2.3,
    -2.3,
    Infinity,
    -Infinity,
    "foo",
    true,
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
    new Date(),
  ]

  for (const keyIterations of wrongKeyIterations) {
    let failed = false

    try {
      await encrypt("hello", "world", { keyIterations })
    } catch (e) {
      failed = true
    }

    expect(failed).toBe(true)
  }

  await (async () => {
    const x = await encrypt("hello", "world", { keyIterations: 100 })
    let failed = false

    try {
      const y = await decrypt(x, "world", { keyIterations: 101 })

      if (y !== "hello") {
        throw new Error()
      }
    } catch (e) {
      failed = true
    }

    expect(failed).toBe(true)
  })()

  await (async () => {
    const x = await encrypt("hello", "world", { keyIterations: 100 })
    let failed = false

    try {
      const y = await decrypt(x, "world", { keyIterations: 100 })

      if (y !== "hello") {
        throw new Error()
      }
    } catch (e) {
      failed = true
    }

    expect(failed).toBe(false)
  })()
})
