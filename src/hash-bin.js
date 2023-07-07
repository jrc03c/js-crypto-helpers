const { indent, unindent, wrap } = require("@jrc03c/js-text-tools")
const { fg, fx } = require("@jrc03c/bash-colors")
const fs = require("node:fs")
const hash = require("./hash")

const { bright, dim } = fx
const { magenta, yellow } = fg

if (
  process.argv.length < 3 ||
  process.argv.length > 3 ||
  process.argv.indexOf("--help") > -1 ||
  process.argv.indexOf("-h") > -1
) {
  console.log(
    wrap(
      indent(
        unindent(`
          Syntax:

            ${bright(magenta("hash [options] [item]"))}

          Options:

            ${yellow("--help, -h")} = show this help text again

            ${yellow("[item]")} = a file or some text

          Examples:

            ${dim("# hash the contents of a file")}
            hash path/to/myfile.txt

            ${dim("# hash some text")}
            hash "Hello, world!"
        `),
        "  "
      )
    )
  )

  process.exit()
}

const item = process.argv[2]

if (fs.existsSync(item) && fs.statSync(item).isFile()) {
  const raw = fs.readFileSync(item, "utf8")
  hash(raw).then(console.log)
} else {
  hash(item).then(console.log)
}
