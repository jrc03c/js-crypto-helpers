const Argument = require("./argument")

test("tests that the Argument class works as expected", () => {
  const fakeArgs = [
    "--file=path/to/file.txt",
    "--maybe",
    "-a",
    "234",
    "-foe",
    "true",
    "-z",
  ]

  const fileArg = new Argument(null, "file", true)
  const maybeArg = new Argument(null, "maybe", false)
  const aArg = new Argument("a", null, true)
  const foeArg = new Argument("foe", null, true)
  const zArg = new Argument("z", null, false)
  const missingArg1 = new Argument(null, "missing1", true)
  const missingArg2 = new Argument(null, "missing2", false)

  expect(fileArg.getValue(fakeArgs)).toBe("path/to/file.txt")
  expect(maybeArg.getValue(fakeArgs)).toBe(true)
  expect(aArg.getValue(fakeArgs)).toBe(234)
  expect(foeArg.getValue(fakeArgs)).toBe(true)
  expect(zArg.getValue(fakeArgs)).toBe(true)
  expect(missingArg1.getValue()).toBe(undefined)
  expect(missingArg2.getValue()).toBe(false)
})
