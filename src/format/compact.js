"use strict"
/**
 * TxParmas Compact Format
 *
 * (Intermediary between normal format & query format)
 */

/* CONSTANTS */
const XLM = { code: "XLM" }

/* Definition */
const encode = {},
  decode = {}

/* Rules: transaction */

encode.txAfter = function (tx) {
  // TODO: move to destruct?
  const minFee = 100 * tx.operations.length
  if (tx.fee === minFee) delete tx.fee
}

/* Rules: operations */

encode.opAfter = function (op) {
  // Useless denominator.
  if (op.price && op.price.d === 1) {
    op.price = op.price.n
  }

  switch (op.type) {
  case "allowTrust":
    // Allow trust by default.
    if (op.authorize) delete op.authorize
    break
  case "createPassiveSellOffer":
  case "manageBuyOffer":
  case "manageSellOffer":
    // Syntactic sugar for offer deletion.
    if (op.offerId && (op.amount === "0" || op.buyAmount === "0")) {
      delete op.buying
      delete op.selling
      delete op.price
    }
    // XLM as default asset.
    if (op.buying && op.selling === XLM) delete op.selling
    if (op.selling && op.buying === XLM) delete op.buying
    break
  case "manageData":
    // Delete data entry.
    if (op.value === "") delete op.value
    break
  case "pathPaymentStrictReceive":
  case "pathPaymentStrictSend":
    // XLM as default asset.
    if (op.destAsset && op.sendAsset === XLM) delete op.sendAsset
    if (op.sendAsset && op.destAsset === XLM) delete op.destAsset
    break
  case "payment":
    // XLM as default asset.
    if (op.asset === XLM) delete op.asset
    break
  }
}

decode.opAfter = function (op, tx) {
  const neutralAsset = { code: "XLM", issuer: tx.specs.pubkey.neutral }

  switch (op.type) {
  case "allowTrust":
    // Allow trust by default.
    if (op.authorize === undefined) op.authorize = true
    break
  case "createPassiveSellOffer":
  case "manageBuyOffer":
  case "manageSellOffer":
    // Syntactic sugar for offer deletion.
    if (op.offerId && (op.amount === "0" || op.buyAmount === "0")) {
      if (!op.buying && !op.selling) op.buying = neutralAsset
      if (!op.price) op.price = "1"
    }
    // XLM as default asset.
    if (op.buying && !op.selling) op.selling = XLM
    if (op.selling && !op.buying) op.buying = XLM
    break
  case "manageData":
    // Delete data entry.
    if (!op.value) op.value = ""
    break
  case "pathPaymentStrictReceive":
  case "pathPaymentStrictSend":
    // XLM as default asset.
    if (op.destAsset && !op.sendAsset) op.sendAsset = XLM
    if (op.sendAsset && !op.destAsset) op.destAsset = XLM
    break
  case "payment":
    // XLM as default asset.
    if (!op.asset) op.asset = XLM
    break
  }
}

/* Rules: fields */

encode.memo = function (memo) {
  if (memo.type === "text" && !memo.value.match(/^text:/)) {
    return memo.value
  } else {
    return memo
  }
}

decode.memo = function (memo) {
  if (typeof memo === "string") {
    return { type: "text", value: memo }
  } else {
    return memo
  }
}

encode.url = function (url) {
  return url.replace(/^https:\/\//, "")
}

decode.url = function (url) {
  if (url.match(/^http(s):\/\//)) {
    return url
  } else {
    return `https://${url}`
  }
}

/* Export */
module.exports = { encode, decode }
