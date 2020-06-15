"use strict"
/**
 * TxParams - Extensible Stellar transactions manipulation
 */

/* Definition */

class TxParams {
  static from (type, data, options) {
    const format = this.getFormat(type)
    const txParams = format.decode.transaction(new this(), data, options)
    txParams.normalize()
    return txParams
  }

  constructor (params) {
    Object.assign(this, params)
    this.parse()
  }

  /* Convertion */
  to (type, options) {
    const format = this.constructor.getFormat(type)
    return format.encode.transaction(this, options)
  }

  /* Editor */
  addOperation (name, params) {
    this.setOperation(this.operations.length, name, params)
    return this
  }

  insertOperation (index, name, params) {
    this.operations.splice(index, 0, 1)
    this.setOperation(index, name, params)
    return this
  }

  setOperation (index, name, params) {
    // this.specs.checkOperationType(name)

    const op = Object.assign({ type: name }, params)
    this.operations[index] = op
    // TODO: this.parse.operation(op)
    this.parse()

    return this
  }

  removeOperation (index) {
    this.operations.splice(index, 1)
    return this
  }
}

/* Data */
TxParams.formats = []

/* Utilities */

TxParams.getFormat = function (type) {
  const format = this.formats[type]
  if (!format) throw new Error(`Unknow format: ${type}`)
  return format
}

TxParams.setSpecs = function (rules) {
  this.prototype.specs = new TxParams.Specs(rules)
}

TxParams.setAction = function (name, rules) {
  const action = new TxParams.Action(rules)
  this.prototype[name] = function (params) {
    return action.transaction(this, params)
  }
}

TxParams.setFormat = function (name, rules) {
  this.formats[name] = new TxParams.Format(rules)
}

/* Export */
TxParams.Action = require("./tx-action")
TxParams.Format = require("./tx-format")
TxParams.Specs = require("./tx-specs")
module.exports = TxParams
