/* eslint-env jasmine */
"use strict"

const TxRequest = require("../../src")
// const test = require("../data-loader")
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
  return new TxRequest(params).to("query")
}
function decode (query) {
  return TxRequest.from("query", query)
}
