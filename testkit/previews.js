"use strict"
/**
 * Previews
 */
const Testkit = require("./index")
const TxParams = require("../src")

/* Logic */
TxParams.setFormat("preview", require("../src/format/preview"))

new Testkit().forEach((test) => {
  const tx = new TxParams(test.params)
  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        preview: tx.to("preview"),
        params: test.params
      },
      null,
      2
    )
  )
})
