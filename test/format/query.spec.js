/* eslint-env jasmine */
"use strict"

const TxParams = require("../../src")
const Testkit = require("../../testkit")

const testkit = new Testkit()

/* Specifications */

describe("Query format", () => {
  it("passes the protocol test", () => {
    testkit.testFormat("query", encode, decode)
  })
})

/* Callbacks */
function encode (params) {
  return new TxParams(params).to("query")
}
function decode (query) {
  return TxParams.from("query", query)
}
