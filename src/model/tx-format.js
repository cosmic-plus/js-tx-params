"use strict"
/**
 * TxRequest.Format
 */
const TxAction = require("./tx-action")

/* Definition */

class TxFormat {
  constructor (params) {
    if (params.encode) {
      this.encode = new TxAction(params.encode)
    }
    if (params.decode) {
      this.decode = new TxAction(params.decode)
    }
  }
}

/* Export */
module.exports = TxFormat
