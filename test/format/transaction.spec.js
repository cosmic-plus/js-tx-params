/* eslint-env jasmine */
"use strict"

const StellarSdk = require("stellar-sdk")

const TxParams = require("../../src")
const Testkit = require("../../testkit")

const testkit = new Testkit()

/* Specifications */

describe("Transaction format", () => {
  it("passes the protocol test", () => {
    testkit.run(decode, "xdr", "json")
  })
})

/* Callbacks */
function decode (xdr) {
  const passphrase = StellarSdk.Networks.TESTNET
  const transaction = new StellarSdk.Transaction(xdr, passphrase)

  const options = { stripNeutralSource: true }
  const txParams = TxParams.from("transaction", transaction, options)
  return txParams.to("json")
}
