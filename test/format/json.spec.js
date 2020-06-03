/* eslint-env jasmine */
"use strict"

const TxParams = require("../../src")
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
  return new TxParams(params).to("json")
}
function decode (query) {
  return TxParams.from("json", query)
}
