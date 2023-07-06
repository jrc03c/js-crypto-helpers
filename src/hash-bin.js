const { indent, unindent, wrap } = require("@jrc03c/js-text-tools")
const { fg, fx } = require("@jrc03c/bash-colors")
const fs = require("node:fs")
const hash = require("./hash")
const path = require("node:path")

const { bright, dim } = fx
const { cyan, yellow } = fg

if (process.argv.length < 3 || process.argv.indexOf("--help") > -1) {
  console.log(
    wrap(
      indent(
        unindent(`
				  Syntax:

				    ${bright(cyan("hash [item]"))}

				  Options:

				    ${yellow("[item]")} = a file or some text

				  Examples:

				    ${dim("# hash the contents of a file")}
				    hash path/to/myfile.txt

				    ${dim("# has some text")}
				    hash "Hello, world!"
				`),
        "  "
      )
    )
  )

  process.exit()
}

const text = Array.from(process.argv).slice(2).join(" ")

if (fs.existsSync(text) && fs.statSync(text).isFile()) {
	const raw = fs.readFileSync(text, "utf8")
	hash(raw).then(console.log)
} else {
	hash(text).then(console.log)
}
