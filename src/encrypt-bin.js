#!/usr/bin/env node

const { stringify } = require("@jrc03c/js-text-tools")
const { fg, fx } = require("@jrc03c/bash-colors")
const Argument = require("./helpers/argument")
const encrypt = require("./encrypt")
const fs = require("node:fs")
const prompt = require("@jrc03c/prompt")
const safeWriteFileSync = require("./helpers/safe-write-file-sync")
const showHelpText = require("./helpers/show-help-text")

const { bright, dim } = fx
const { magenta, yellow } = fg

const helpArg = new Argument("h", "help", false)
const outfileArg = new Argument("o", "outfile", true)
const passwordArg = new Argument("p", "password", true)

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
  if (process.argv.length < 3 || helpArg.getValue()) {
    return showHelpText(helpText)
  }

  const outfile = outfileArg.getValue()
  const password = passwordArg.getValue() || (await prompt("Password:", true))

  const item = (() => {
    const item = process.argv.at(-1)

    if (fs.existsSync(item) && fs.statSync(item).isFile()) {
      return fs.readFileSync(item, "utf8")
    } else {
      return process.argv.at(-1)
    }
  })()

  const out = stringify(await encrypt(item, password))

  if (outfile) {
    safeWriteFileSync(outfile, out, "utf8")
  } else {
    console.log(out)
  }
})()
