"use strict"
/**
 * Generate data.json
 */
const Testkit = require("./index")
Testkit.generate()
  .then(data => {
    const json = JSON.stringify(data, null, 2)
    // eslint-disable-next-line no-console
    console.log(json)
  })
  .catch(console.error)
