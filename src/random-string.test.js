const {
  isEqual,
  isNumber,
  isString,
  isUndefined,
  set,
  sort,
} = require("@jrc03c/js-math-tools")

const randomString = require("./random-string")

test("tests that random strings can be generated correctly", () => {
  const a = randomString(123)
  expect(a.length).toBe(123)
  expect(isString(a)).toBe(true)

  const b = randomString(256)
  const c = randomString(256)
  expect(b).not.toBe(c)
  expect(b.length).toBe(256)
  expect(c.length).toBe(256)

  const d = randomString(1024, "abc123")
  const eTrue = sort(["a", "b", "c", "1", "2", "3"])
  const ePred = sort(set(d.split("")))
  expect(isEqual(ePred, eTrue)).toBe(true)

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
    "a",
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
    new Date(),
    selfReferencer,
  ]

  for (const v1 of variables) {
    for (const v2 of variables) {
      if (
        !(
          (isUndefined(v1) ||
            (isNumber(v1) && Math.floor(v1) === v1 && v1 > 0)) &&
          (isUndefined(v2) || (isString(v2) && v2.length > 1))
        )
      ) {
        expect(() => randomString(v1, v2)).toThrow()
      }
    }
  }
})
