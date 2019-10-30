"use strict"
/**
 * Protocol 12 specifications.
 */
const TxSpecs = require("../model/tx-specs")

/* Specs */
const specs = new TxSpecs()

specs.tx = {
  mandatory: ["operations"],
  optional: [
    "network",
    "horizon",
    "callback",
    "memo",
    "source",
    "sequence",
    "minTime",
    "maxTime",
    "fee"
  ]
}

specs.op = {}

specs.op.accountMerge = {
  mandatory: ["destination"],
  optional: ["source"]
}

specs.op.allowTrust = {
  mandatory: ["authorize", "assetCode", "trustor"],
  optional: ["source"]
}

specs.op.bumpSequence = {
  mandatory: ["bumpTo"],
  optional: ["source"]
}

specs.op.changeTrust = {
  mandatory: ["asset"],
  optional: ["source", "limit"]
}

specs.op.createAccount = {
  mandatory: ["destination", "startingBalance"],
  optional: ["source"]
}

specs.op.createPassiveSellOffer = {
  mandatory: ["selling", "buying", "amount", "price"],
  optional: ["source"]
}

specs.op.manageData = {
  mandatory: ["name", "value"],
  optional: ["source"]
}

specs.op.manageBuyOffer = {
  mandatory: ["selling", "buying", "buyAmount", "price"],
  optional: ["source", "offerId"]
}

specs.op.manageSellOffer = {
  mandatory: ["selling", "buying", "amount", "price"],
  optional: ["source", "offerId"]
}

specs.op.pathPaymentStrictReceive = {
  mandatory: ["sendAsset", "sendMax", "destination", "destAsset", "destAmount"],
  optional: ["source", "path"]
}

specs.op.pathPaymentStrictSend = {
  mandatory: ["sendAsset", "sendAmount", "destination", "destAsset", "destMin"],
  optional: ["source", "path"]
}

specs.op.payment = {
  mandatory: ["asset", "destination", "amount"],
  optional: ["source"]
}

specs.op.setOptions = {
  mandatory: [],
  optional: [
    "source",
    "clearFlags",
    "setFlags",
    "masterWeight",
    "lowThreshold",
    "medThreshold",
    "highThreshold",
    "signer",
    "homeDomain"
  ]
}

/* Field types */
specs.type = {
  amount: "amount",
  asset: "asset",
  assetCode: "string",
  assetIssuer: "address",
  authorize: "boolean",
  bumpTo: "sequence",
  buyAmount: "amount",
  buying: "asset",
  callback: "url",
  clearFlags: "flags",
  destAsset: "asset",
  destAmount: "amount",
  destMin: "amount",
  destination: "address",
  fee: "fee",
  highThreshold: "threshold",
  homeDomain: "string",
  horizon: "url",
  limit: "amount",
  lowThreshold: "threshold",
  masterWeight: "weight",
  maxTime: "date",
  medThreshold: "threshold",
  memo: "memo",
  memoBinary: "hash",
  memoHash: "hash",
  memoId: "id",
  memoReturn: "hash",
  memoText: "string",
  memoType: "string",
  minTime: "date",
  network: "network",
  offerId: "string",
  operations: "operations",
  price: "price",
  name: "string",
  path: "assetPath",
  selling: "asset",
  sendAmount: "amount",
  sendAsset: "asset",
  sendMax: "amount",
  sequence: "sequence",
  setFlags: "flags",
  signer: "signer",
  signerHash: "hash",
  signerKey: "address",
  signerType: "string",
  signerTx: "id",
  signerWeight: "weight",
  source: "address",
  startingBalance: "amount",
  trustor: "address",
  value: "buffer"
}

/* Pubkey */

specs.pubkey = {
  neutral: "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF"
}

/* Export */
module.exports = specs
