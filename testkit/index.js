"use strict"
/**
 * TxParams TestKit
 */
const { CosmicLink } = require("cosmic-lib")
const $status = require("../src/lib/status")

/* Definition */

class Testkit extends Array {
  constructor (data = Testkit.data) {
    super()

    Object.assign(this, data)
    this.forEach(tx => {
      tx.json = JSON.stringify(tx.params, null, 2)
    })
  }

  testFormat (formatName, encoder, decoder) {
    const encode = json => encoder(JSON.parse(json))
    const decode = any => JSON.stringify(decoder(any), null, 2)
    this.run(encode, "json", formatName)
    this.run(decode, formatName, "json")
  }

  run (converter, inputFmt, outputFmt) {
    let testCount = 0,
      errorCount = 0

    this.forEach(tx => {
      testCount++
      try {
        const actual = converter(tx[inputFmt])
        const reference = tx[`${outputFmt}Converted`] || tx[outputFmt]
        if (!tx.noConversion && actual !== reference) {
          throw new Error(`Expected: ${reference}\nReceived: ${actual}`)
        }
      } catch (error) {
        const title = `[${inputFmt} => ${outputFmt}] ${tx.name}`
        $status(converter).error(`\n${title}\n${error.message}\n`)
        errorCount++
      }
    })

    const errors = $status(converter).messages
    if (errors.length) {
      throw new Error(`${errorCount} failures out of ${testCount} tests`)
    }
  }
}

/* Utilities */

Testkit.generate = async function (data = Testkit.source) {
  const promises = data.map(Testkit.generate.promise)
  await Promise.all(promises)
  return data
}

Testkit.generate.promise = async function (tx) {
  const cosmicLink = new CosmicLink(tx.query)
  tx.params = JSON.parse(cosmicLink.json)

  // Special case: use complete date.
  if (tx.params.minTime && tx.params.minTime.length === 4) {
    tx.params.minTime += "-01-01"
  }
  if (tx.params.maxTime && tx.params.maxTime.length === 4) {
    tx.params.maxTime += "-01-01"
  }

  // Generate XDR
  if (!tx.noXdr) {
    await cosmicLink.lock({ network: "test" })
    tx.xdr = cosmicLink.xdr
  }

  return tx
}

/* Export */
Testkit.source = require("./source")
Testkit.data = require("./data.json")
module.exports = Testkit
