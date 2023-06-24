// NOTE: The `parse` and `stringify` functions intentionally avoid handling
// functions. Functions can be stringified relatively easily, but parsing their
// string forms back into functions is a huge security risk. According to MDN,
// using `new Function("...")` is basically just as insecure as using `eval`.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function

const { isEqual } = require("@jrc03c/js-math-tools")
const parse = require("./parse")
const stringify = require("./stringify")

test("tests that values can be stringified correctly", () => {
  const selfReferencer = [2, 3, 4]
  selfReferencer.push(selfReferencer)

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
    selfReferencer,
  ]

  variables.forEach(value => {
    const out = stringify(value)
    expect(typeof out).toBe("string")
  })

  for (const i in variables) {
    for (const j in variables) {
      if (i !== j) {
        const v1 = variables[i]
        const v2 = variables[j]
        expect(stringify(v1)).not.toBe(stringify(v2))
      }
    }
  }
})

test("tests that values can be stringified and parsed back to their original value", () => {
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

  variables.forEach(value => {
    const s = stringify(value)
    const p = parse(s)
    expect(isEqual(value, p)).toBe(true)
  })
})
