/* eslint-env jasmine */
"use strict"

const TxRequest = require("../../src")
// const test = require("../data-loader")
const Testkit = require("../../testkit")

const testkit = new Testkit()

/* Specifications */

describe("Json format", () => {
  it("passes the protocol test", () => {
    testkit.testFormat("json", encode, decode)
  })
})

/* Callbacks */
function encode (params) {
  return new TxRequest(params).to("json")
}
function decode (query) {
  return TxRequest.from("json", query)
}
