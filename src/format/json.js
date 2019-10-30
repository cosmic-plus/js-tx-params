"use strict"
/**
 * TxParams Format: JSON
 */

/* Definition */
const encode = {},
  decode = {}

/* Rules: transaction */

encode.transaction = function (tx) {
  return JSON.stringify(tx, null, 2)
}

decode.transaction = function (tx, json) {
  const params = JSON.parse(json)
  return new tx.constructor(params)
}

/* Export */
module.exports = { encode, decode }
