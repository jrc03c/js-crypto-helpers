#!/usr/bin/env node

const { execSync } = require("node:child_process")
const { fg, fx } = require("@jrc03c/bash-colors")
const Argument = require("./helpers/argument")
const randomString = require("./random-string")
const safeWriteFileSync = require("./helpers/safe-write-file-sync")
const showHelpText = require("./helpers/show-help-text")

const { bright, dim } = fx
const { magenta, yellow } = fg

const charsetArg = new Argument("c", "charset", true)
const helpArg = new Argument("h", "help", false)
const lengthArg = new Argument("l", "length", true)
const outfileArg = new Argument("o", "outfile", true)

if (helpArg.getValue()) {
  showHelpText(`
    Syntax:

      ${bright(magenta("random-string [options]"))}

    Options:

      ${yellow("--help, -h")} = show this help text again

      ${yellow(
        "--outfile, -o"
      )} = (optional) an output file to which to write the randomStringed data; if not provided, then the randomStringed data is just printed to stdout

      ${yellow(
        "--charset, -c"
      )} = (optional) a character set from which to construct the random string

      ${yellow(
        "--length, -l"
      )} = (optional) the length of the generated string; the default is 256

    Examples:

      ${dim("# generate a random string that is 256 characters in length")}
      random-string

      ${dim("# generate a random string that is 8 characters in length")}
      random-string -l 8

      ${dim("# generate a random string and save it to a file")}
      random-string --outfile=path/to/myfile.txt
  `)

  process.exit()
}

!(async () => {
  const outfile = outfileArg.getValue()
  const length = lengthArg.getValue()
  const charset = charsetArg.getValue()

  const out = randomString(length, charset)

  if (outfile) {
    safeWriteFileSync(outfile, out, "utf8")
  } else {
    console.log(out)

    try {
      execSync(`echo "${out}" | xsel -b`, { encoding: "utf8" })
    } catch (e) {
      // ...
    }
  }
})()
