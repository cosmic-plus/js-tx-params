"use strict"
/**
 * TxParams format: SDK Transaction
 */
const misc = require("@cosmic-plus/jsutils/es5/misc")

/* Definition */
const decode = {}

/* Rules: transaction */

decode.txBefore = function (tx, sdkTx, options = {}) {
  // Prevent parameters pollution
  if (options) options = Object.create(options)

  if (sdkTx.source === tx.specs.pubkey.neutral && options.stripNeutralSource) {
    options.strip = "source"
  } else if (sdkTx.sequence === "0" && options.stripNeutralSequence) {
    options.strip = "sequence"
  }

  tx.network = options.network
  tx.horizon = options.horizon
  tx.callback = options.callback

  if (options.strip !== "source") {
    tx.source = sdkTx.source
    if (options.strip !== "sequence") {
      tx.sequence = sdkTx.sequence
    }
  }

  if (sdkTx.timeBounds) {
    tx.minTime = sdkTx.timeBounds.minTime
    tx.maxTime = sdkTx.timeBounds.maxTime
  }

  tx.memo = sdkTx._memo
  tx.fee = sdkTx.fee
  tx.operations = sdkTx.operations

  return tx
}

decode.txAfter = function (tx) {
  // Move operations to the end of the object
  const operations = tx.operations
  delete tx.operations
  tx.operations = operations
}

/* Rules: operations */

decode.opBefore = function (sdkOp) {
  const op = Object.assign({}, sdkOp)
  if ("line" in op) {
    op.asset = op.line
    delete op.line
  }
}

/* Rules: fields */

decode.asset = function (asset) {
  return Object.assign({}, asset)
}

decode.assetPath = function (assetPath) {
  return assetPath.map(asset => decode.asset(asset))
}

decode.amount = function (amount) {
  const amountStr = String(amount)
  // Remove useless decimals (but don't mutate "fee")
  // TODO: use a dedicated type for fees?
  if (amountStr.match(/\./)) {
    return amountStr.replace(/\.?0+$/, "")
  } else {
    return amountStr
  }
}

decode.buffer = function (buffer) {
  if (!buffer) return null

  const string = buffer.toString()
  if (misc.isUtf8(string)) {
    return { type: "text", value: string }
  } else {
    const value = buffer.toString("base64").replace(/=*$/, "")
    return { type: "base64", value: value }
  }
}

decode.date = function (timestamp) {
  if (timestamp === "0") return
  return new Date(Number(timestamp) * 1000).toISOString()
}

decode.memo = function (sdkMemo) {
  if (sdkMemo._switch.name === "memoNode") return

  const memo = { type: sdkMemo._arm }

  switch (memo.type) {
  case "text":
    return decode.buffer(sdkMemo._value)
  case "retHash":
    memo.type = "return"
    // Fallthrough
  case "hash":
    memo.value = sdkMemo._value.toString("hex")
    return memo
  case "id":
    memo.value = sdkMemo._value.toString()
    return memo
  }
}

decode.sequence = function (sequence) {
  return sequence.toString()
}

decode.signer = function (conf, sdkSigner) {
  const signer = { weight: sdkSigner.weight }
  if (sdkSigner.ed25519PublicKey) {
    signer.type = "key"
    signer.value = sdkSigner.ed25519PublicKey
  } else if (sdkSigner.sha256Hash) {
    signer.type = "hash"
    signer.value = sdkSigner.sha256Hash.toString("hex")
  } else if (sdkSigner.preAuthTx) {
    signer.type = "tx"
    signer.value = sdkSigner.preAuthTx.toString("hex")
  }
  return signer
}

/* Export */
module.exports = { decode }
