/* eslint-env jasmine */
"use strict"

const TxParams = require("../src")
const { any } = jasmine

/* Specifications */

describe("TxParams()", () => {
  it("returns an instance of TxParams", () => {
    expect(new TxParams()).toEqual(any(TxParams))
  })

  it("accepts tx parameters", () => {
    const request = new TxParams({ network: "public" })
    expect(Object.keys(request)).toEqual(["network", "operations"])
    expect(request.network).toEqual("public")
    expect(request.operations).toEqual([])
  })

  describe(".addOperation()", () => {
    it("adds a new operation", () => {
      const request = new TxParams().addOperation("payment", {
        destination: "tips*cosmic.plus",
        amount: 20
      })
      expect(request.operations).toEqual([
        {
          type: "payment",
          destination: "tips*cosmic.plus",
          asset: { code: "XLM" },
          amount: 20
        }
      ])
    })
  })
})
