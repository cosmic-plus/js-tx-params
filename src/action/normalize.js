"use strict"
/**
 * Normalize TxParams
 */

/* Definition */
const normalize = {}

/* Rules: transaction */

normalize.txAfter = function (tx) {
  // TODO: move to deconstruct.
  const minFee = String(100 * tx.operations.length)
  if (tx.fee === minFee) delete tx.fee

  if (tx.network === "public" || tx.network === "test") {
    delete tx.horizon
  } // TODO: else, tx.horizon = TxParams.resolve.horizon(tx.network)

  tx.check()
}

/* Rules: operations */

normalize.opBefore = function (op) {
  switch (op.type) {
  case "createPassiveOffer":
    op.type = "createPassiveSellOffer"
    break
  case "manageOffer":
    op.type = "manageSellOffer"
    break
  case "pathPayment":
    op.type = "pathPaymentStrictReceive"
    break
  }
}

normalize.opAfter = function (op, tx) {
  const XLM = { code: "XLM" }
  const neutralAsset = { code: "XLM", issuer: tx.specs.pubkey.neutral }

  // No limit = maximum limit.
  if (op.limit === "922337203685.4775807") delete op.limit
  // New offer.
  if (op.offerId === "0") delete op.offerId
  // Empty asset conversion path.
  if (op.path && !op.path.length) delete op.path
  // Useless denominator.
  if (op.price && op.price.d === 1) op.price = op.price.n

  switch (op.type) {
  case "allowTrust":
    // Allow trust by default.
    if (op.authorize === undefined) op.authorize = true
    break
  case "createPassiveSellOffer":
  case "manageBuyOffer":
  case "manageSellOffer":
    // Syntactic sugar for offer deletion
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

normalize.amount = function (amount) {
  return String(amount)
}

normalize.date = function (date) {
  // Syntactic sugar: "+{mins}".
  if (date.match(/^\+[0-9]+$/)) {
    const shifted = new Date()
    shifted.setMinutes(shifted.getMinutes() + +date.substr(1))
    date = shifted.toISOString().replace(/\.[0-9]{3}/, "")
  }
  // Strip superfluous data.

  return date
    .replace(/:00\.000/, "")
    .replace(/\.000/, "")
    .replace(/T00:00Z/, "")
}

normalize.memo = function (memo) {
  if (typeof memo === "string") {
    return { type: "text", value: memo }
  } else {
    return memo
  }
}

normalize.url = function (url) {
  return url.substr(0, 4) === "http" ? url : "https://" + url
}

normalize.weight = function (amount) {
  return String(amount)
}

/* Export */
module.exports = normalize
