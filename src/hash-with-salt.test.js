// eslint-disable-next-line no-unused-vars
const crypto = require("node:crypto")
const hash = require("./hash")
const hashWithSalt = require("./hash-with-salt")
const makeKey = require("./make-key")

test("tests that values can be hashed with salt correctly", async () => {
  const a = "Hello, world!"
  const b = await hashWithSalt(a)
  expect(b.value).not.toBe(a)
  expect((await hashWithSalt(b)).value).not.toBe(a)
  expect(typeof b.salt).toBe("string")
  expect(b.salt.length).toBe(256)

  const c = makeKey(4)
  const d = makeKey(256)

  expect((await hashWithSalt(c)).value.length).toBe(
    (await hashWithSalt(d)).value.length
  )

  const e = Math.random()
  expect(await hash(e)).toBe(await hash(e))
  expect((await hashWithSalt(e)).value).not.toBe((await hashWithSalt(e)).value)
  expect(await hash(e)).not.toBe((await hashWithSalt(e)).value)

  const f = { hello: "world" }
  const hashLength = 7
  expect((await hashWithSalt(f, hashLength)).salt.length).toBe(hashLength)

  const variables = [
    0,
    1,
    2.3,
    -2.3,
    Infinity,
    -Infinity,
    NaN,
    "foo",
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

  for (const value in variables) {
    let failed = false

    try {
      const result = await hashWithSalt(value)
      expect(typeof result.value).toBe("string")
      expect(typeof result.salt).toBe("string")
    } catch (e) {
      failed = true
    }

    expect(failed).toBe(false)
  }

  for (const v1 in variables) {
    for (const v2 in variables) {
      let failed = false

      try {
        if (isNaN(v2)) {
          await hashWithSalt(v1, v2)
        } else {
          throw new Error()
        }
      } catch (e) {
        failed = true
      }

      expect(failed).toBe(true)
    }
  }
})
