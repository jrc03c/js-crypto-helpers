const { indent, unindent, wrap } = require("@jrc03c/js-text-tools")

function showHelpText(text) {
  console.log(wrap(indent(unindent(text), "  ")))
}

module.exports = showHelpText
