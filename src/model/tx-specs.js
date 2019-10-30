"use strict"
/**
 * TxSpecs - Wraps Stellar transaction specifications.
 */

/* Definition */

class TxSpecs {
  constructor (specs) {
    Object.assign(this, specs)
  }

  /* Data */

  txMandatoryFields () {
    return this.tx.mandatory
  }

  txOptionalFields () {
    return this.tx.optional
  }

  opMandatoryFields (opType) {
    return this.op[opType].mandatory
  }

  opOptionalFields (opType) {
    return this.op[opType].optional
  }

  fieldType (field) {
    return this.type[field]
  }

  /* Tests */

  isTxField (field) {
    return this.isTxMandatoryField(field) || this.isTxOptionalField(field)
  }

  isTxMandatoryField (field) {
    return this.tx.mandatory.includes(field)
  }

  isTxOptionalField (field) {
    return this.tx.optional.includes(field)
  }

  isOpType (opType) {
    return !!this.op[opType]
  }

  isOpField (opType, field) {
    return (
      this.isOpMandatoryField(opType, field)
      || this.isOpOptionalField(opType, field)
    )
  }

  isOpMandatoryField (opType, field) {
    return !!this.op[opType].mandatory.includes(field)
  }

  isOpOptionalField (opType, field) {
    return !!this.op[opType].optional.includes(field)
  }
}

/* Export */
module.exports = TxSpecs
