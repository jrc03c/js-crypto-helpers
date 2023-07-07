const { indent, stringify, unindent, wrap } = require("@jrc03c/js-text-tools")
const { fg, fx } = require("@jrc03c/bash-colors")
const encrypt = require("./encrypt")
const fs = require("node:fs")
const prompt = require("@jrc03c/prompt")

const { bright, dim } = fx
const { magenta, yellow } = fg

function showHelpText() {
  console.log(
    wrap(
      indent(
        unindent(`
          Syntax:

            ${bright(magenta("encrypt [options] [item]"))}

          Options:

            ${yellow("--help, -h")} = show this help text again

            ${yellow(
              "--password, -p"
            )} = (optional) the password with which to encrypt the item; if not used, then the user will be prompted to input a password (hidden with asterisks)

            ${yellow("[item]")} = a file or some text

          Examples:

            ${dim("# encrypt the contents of a file")}
            encrypt path/to/myfile.txt

            ${dim("# encrypt some text with a given password")}
            encrypt -p "p455w0rd!" "Hello, world!"
            encrypt --password="p455w0rd!" "Hello, world!"
        `),
        "  "
      )
    )
  )

  process.exit()
}

!(async () => {
  if (
    process.argv.length < 3 ||
    process.argv.length > 5 ||
    process.argv.indexOf("--help") > -1 ||
    process.argv.indexOf("-h") > -1
  ) {
    return showHelpText()
  }

  const args = Array.from(process.argv).slice(2)

  let item, password

  if (args.length === 1) {
    item = args[0]
  }

  if (args.length === 2) {
    if (!args[1].includes("--password")) {
      return showHelpText()
    }

    password = args[1].split("--password=")[1]
  }

  if (args.length === 3) {
    if (args[0] !== "-p") {
      return showHelpText()
    }

    password = args[1]
  }

  if (!password) {
    password = await prompt("Password:", true)
  }

  if (fs.existsSync(item) && fs.statSync(item).isFile()) {
    const raw = fs.readFileSync(item, "utf8")
    const out = await encrypt(raw, password)
    console.log(stringify(out))
  } else {
    const out = await encrypt(item, password)
    console.log(stringify(out))
  }
})()
