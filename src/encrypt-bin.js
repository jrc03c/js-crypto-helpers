const { stringify } = require("@jrc03c/js-text-tools")
const { fg, fx } = require("@jrc03c/bash-colors")
const encrypt = require("./encrypt")
const findArg = require("./helpers/find-arg")
const fs = require("node:fs")
const path = require("node:path")
const prompt = require("@jrc03c/prompt")
const showHelpText = require("./helpers/show-help-text")

const { bright, dim } = fx
const { magenta, yellow } = fg

const helpText = `
  Syntax:

    ${bright(magenta("encrypt [options] [item]"))}

  Options:

    ${yellow("--help, -h")} = show this help text again

    ${yellow(
      "--outfile, -o"
    )} = (optional) an output file to which to write the encrypted data; if not provided, then the encrypted data is just printed to stdout

    ${yellow(
      "--password, -p"
    )} = (optional) the password with which to encrypt the item; if not used, then the user will be prompted to input a password (hidden with asterisks)

    ${yellow("[item]")} = a file or some text

  Examples:

    ${dim("# encrypt the contents of a file")}
    encrypt path/to/myfile.txt

    ${dim(
      "# encrypt the contents of a file and save the result into another file"
    )}
    encrypt -o path/to/encrypted.txt path/to/myfile.txt

    ${dim("# encrypt some text with a given password")}
    encrypt -p "p455w0rd!" "Hello, world!"
    encrypt --password="p455w0rd!" "Hello, world!"

    ${dim("# encrypt some text and save the result into a file")}
    encrypt --outfile=path/to/encrypted.txt "Hello, world!"
  `

!(async () => {
  if (process.argv.length < 3 || findArg("--help") || findArg("-h")) {
    return showHelpText(helpText)
  }

  const args = Array.from(process.argv).slice(2)

  const outfile = (() => {
    const arg = findArg(args, v => v.includes("--outfile=") || v === "-o")
    const index = args.indexOf(arg)

    if (arg) {
      if (arg.includes("--outfile=")) {
        args.splice(index, 1)
        return path.resolve(arg.split("--outfile=")[1])
      } else {
        const value = args[index + 1]
        args.splice(index, 2)
        return path.resolve(value)
      }
    }
  })()

  const password = await (async () => {
    const arg = findArg(args, v => v.includes("--password=") || v === "-p")
    const index = args.indexOf(arg)

    if (arg) {
      if (arg.includes("--password=")) {
        args.splice(index, 1)
        return arg.split("--password=")[1]
      } else {
        const value = args[index + 1]
        args.splice(index, 2)
        return value
      }
    } else {
      return await prompt("Password:", true)
    }
  })()

  const item = args.at(-1)

  if (fs.existsSync(item) && fs.statSync(item).isFile()) {
    const raw = fs.readFileSync(item, "utf8")
    const out = stringify(await encrypt(raw, password))

    if (outfile) {
      const dir = outfile.split("/").slice(0, -1).join("/")

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      fs.writeFileSync(outfile, stringify(out), "utf8")
    } else {
      console.log(out)
    }
  } else {
    const out = stringify(await encrypt(item, password))

    if (outfile) {
      const dir = outfile.split("/").slice(0, -1).join("/")

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      fs.writeFileSync(outfile, stringify(out), "utf8")
    } else {
      console.log(out)
    }
  }
})()
