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
function decode (xdr, tx) {
  const passphrase = StellarSdk.Networks.TESTNET
  const transaction = new StellarSdk.Transaction(xdr, passphrase)

  const options = { stripNeutralSource: !tx.params.source }
  const txParams = TxParams.from("transaction", transaction, options)
  if (tx.params.source && !tx.params.sequence) {
    delete txParams.sequence
  }

  return txParams.to("json")
}
