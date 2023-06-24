// NOTE: The `hash` function intentionally does not handle functions. See the
// note in `stringify-and-parse.test.js` for more info.

// eslint-disable-next-line no-unused-vars
const crypto = require("node:crypto")
const hash = require("./hash")
const makeKey = require("./make-key")

test("tests that values can be hashed correctly", async () => {
  const a = "Hello, world!"
  const b = await hash(a)
  expect(b === a).toBe(false)
  expect(b === (await hash(a))).toBe(true)
  expect((await hash(b)) === a).toBe(false)

  const c = makeKey(4)
  const d = makeKey(256)
  expect(await hash(c)).not.toBe(await hash(d))
  expect(await hash(c).length).toBe(await hash(d).length)

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
    { hello: "world" },
  ]

  for (const value in variables) {
    let failed = false

    try {
      expect(await hash(value)).toBe(await hash(value))
    } catch (e) {
      failed = true
    }

    expect(failed).toBe(false)
  }

  for (const i in variables) {
    for (const j in variables) {
      if (i !== j) {
        const v1 = variables[i]
        const v2 = variables[j]
        expect(await hash(v1)).not.toBe(await hash(v2))
      }
    }
  }
})
