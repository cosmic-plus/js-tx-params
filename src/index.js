"use strict"
/**
 *
 */
const TxParams = require("./model/tx-params")

/* Protocol */
TxParams.setSpecs(require("./protocol/v15"))

/* Actions */
TxParams.setAction("check", require("./action/check"))
TxParams.setAction("normalize", require("./action/normalize"))
TxParams.setAction("parse", require("./action/parse"))

/* Formats */
TxParams.setFormat("query", require("./format/query"))
TxParams.setFormat("json", require("./format/json"))
TxParams.setFormat("transaction", require("./format/transaction"))

/* Export */
module.exports = TxParams
