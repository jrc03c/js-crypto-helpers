const { parse } = require("@jrc03c/js-text-tools")

class Argument {
  short = ""
  long = ""
  takesAnArgument = ""

  constructor(short, long, takesAnArgument) {
    this.short = short
    this.long = long

    this.takesAnArgument =
      typeof takesAnArgument === "undefined" ? true : takesAnArgument
  }

  getValue(rawArgs) {
    if (!rawArgs) {
      rawArgs = Array.from(process.argv)
    }

    if (!(rawArgs instanceof Array)) {
      throw new Error(
        "The first argument passed into the `getValueOfArg` method must be an array of strings!"
      )
    }

    rawArgs.forEach(v => {
      if (typeof v !== "string") {
        throw new Error(
          "The first argument passed into the `getValueOfArg` method must be an array of strings!"
        )
      }
    })

    for (let i in rawArgs) {
      i = parseInt(i)
      let raw = rawArgs[i]

      if (raw.startsWith("--")) {
        if (raw.includes(this.long)) {
          if (this.takesAnArgument) {
            if (!raw.includes("=")) {
              throw new Error(
                `The --${this.long} parameter requires a value! For example: --${this.long}=whatever`
              )
            }

            const out = raw.split("=").slice(1).join("=")

            try {
              return parse(out)
            } catch (e) {
              return out
            }
          } else {
            return true
          }
        }
      } else if (raw.startsWith("-")) {
        raw = raw.split("-").slice(1).join("-")

        if (raw === this.short) {
          if (this.takesAnArgument) {
            if (i >= rawArgs.length - 1) {
              throw new Error(
                `The -${this.short} parameter requires a value! For example: -${this.short} whatever`
              )
            }

            const out = rawArgs[i + 1]

            try {
              return parse(out)
            } catch (e) {
              return out
            }
          } else {
            return true
          }
        }
      }
    }

    if (this.takesAnArgument) {
      return undefined
    } else {
      return false
    }
  }
}

module.exports = Argument
