"use strict"
/**
 * TxParams.Action
 */
const { xeach } = require("@kisbox/helpers")

/* Definition */

class TxAction {
  constructor (rules) {
    Object.assign(this, rules)
  }

  transaction (tx, ...params) {
    if (this.txBefore) tx = this.txBefore(tx, ...params) || tx
    this.iterate(tx, tx)
    if (this.txAfter) tx = this.txAfter(tx, ...params) || tx
    return tx
  }

  operations (ops, tx) {
    return ops.map((op) => {
      if (this.opBefore) op = this.opBefore(op, tx) || op
      this.iterate(op, tx)
      if (this.opAfter) op = this.opAfter(op, tx) || op
      return op
    })
  }

  iterate (object, tx) {
    xeach(object, (value, key) => {
      if (value !== undefined) {
        const output = this.field(key, value, tx)
        if (output === undefined) {
          delete object[key]
        } else {
          object[key] = output
        }
      }
    })
  }

  field (key, value, tx) {
    const type = tx.specs.fieldType(key)
    if (this[type]) {
      return this[type](value, tx)
    } else if (this["any"]) {
      return this["any"](value, tx)
    } else {
      return value
    }
  }
}

/* Export */
module.exports = TxAction
