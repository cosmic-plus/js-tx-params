"use strict"
/**
 * Parse TxParams
 */

/* Definition */
const parse = {}

/* Rules: transaction */

parse.txBefore = function (tx) {
  if (!tx.operations) tx.operations = []
  removeEmptyFields(tx)
}

parse.txAfter = function (tx) {
  tx.normalize()
}

/* Rules: operations */
parse.opBefore = function (op) {
  removeEmptyFields(op)
}

/* Rules: fields */

/* Helpers */
function removeEmptyFields (object) {
  for (let field in object) {
    if (object[field] == null) {
      delete object[field]
    }
  }
}

/* Export */
module.exports = parse
