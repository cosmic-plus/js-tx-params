"use strict"
/**
 * Parse TxParams
 *
 * This is the parser for parameters passed as JavaScript object. Parameters may
 * be encoded in one of three forms:
 *
 * 1. The normal TxParams form.
 * 2. The query form.
 * 3. The StellarSdk form.
 *
 * This action dispatch the data to the right decoder & turns everything into
 * the normalized TxParams form.
 */
const { type } = require("@kisbox/utils")

const transaction = require("../format/transaction")
const query = require("../format/query")

/* Definition */
const parse = {}

/* Rules: transaction */

parse.txAfter = function (tx) {
  tx.normalize()
}

/* Rules: operations */

/* Rules: fields */

parse.asset = function (asset) {
  if (typeof asset === "string") {
    return query.decode.asset(asset)
  } else {
    return asset
  }
}

parse.assetPath = function (assetPath) {
  if (typeof assetPath === "string") {
    return query.decode.assetPath(assetPath)
  } else if (Array.isArray(assetPath)) {
    return assetPath.map(asset => parse.asset(asset))
  }
}

parse.buffer = function (buffer) {
  if (!buffer) {
    return { type: "text", value: "" }
  } else if (buffer instanceof Buffer) {
    return transaction.decode.buffer(buffer)
  } else if (typeof buffer === "string") {
    return query.decode.buffer(buffer)
  } else {
    return buffer
  }
}

parse.date = function (date) {
  if (type(date) === "date") {
    return date.toISOString()
  } else if (typeof date === "number") {
    date = String(date)
  }

  if (date.match(/^[0-9]*$/ && date.length > 4)) {
    // Timestamp
    return transaction.decode.date(date)
  } else {
    // ISO Date or `+x`
    return query.decode.date(date)
  }
}

parse.memo = function (memo) {
  if (typeof memo === "string") {
    return query.decode.memo(memo)
  } else if (memo._type && memo._value) {
    return transaction.decode.memo(memo)
  } else {
    return memo
  }
}

parse.price = function (price) {
  if (typeof price === "string" && price.match(/:/)) {
    return query.decode.price(price)
  } else {
    return price
  }
}

parse.signer = function (signer) {
  if (typeof signer === "string") {
    return query.decode.signer(signer)
  } else {
    return signer
  }
}

parse.string = function (string) {
  if (typeof string === "number") {
    return String(string)
  } else {
    return string
  }
}

/* Export */
module.exports = parse
