"use strict"
/**
 * Short text preview
 */
const { nice } = require("@cosmic-plus/utils")
const { shorter } = require("@cosmic-plus/helpers")
const aliases = require("@cosmic-plus/base/es5/aliases")

/* Definition */
const encode = {}

/* Rules: transaction */

encode.txBefore = function (tx) {
  tx.opNum = tx.operations.length
  tx.operations.length = 1
}

encode.txAfter = function (tx) {
  let msg = tx.operations[0]
  if (tx.opNum > 1) {
    msg += ` [+${tx.opNum - 1}]`
  }

  if (tx.network) {
    msg += ` (on ${tx.network})`
  }
  return msg
}

/* Rules: operations */

encode.opAfter = function (op) {
  let msg

  switch (op.type) {
  case "accountMerge":
    return `Merge account inside ${op.destination}`
  case "allowTrust":
    if (op.authorize === 2) {
      return `Allow liabilities for your asset ${op.assetCode} to ${op.trustor}`
    } else if (op.authorize === 1) {
      return `Allow ${op.trustor} to use your asset ${op.assetCode}`
    } else {
      return `Forbid ${op.trustor} to use your asset ${op.assetCode}`
    }
  case "bumpSequence":
    return `Set account sequence to ${op.bumpTo}`
  case "changeTrust":
    if (op.limit === "0") {
      return `Refuse asset ${op.asset}`
    } else if (op.limit) {
      return `Set asset ${op.asset} holding limit to ${op.limit}`
    } else {
      return `Accept asset ${op.asset}`
    }
  case "createAccount":
    return `Create account ${op.destination} with ${op.startingBalance} XLM`
  case "createPassiveSellOffer":
    return `Passive offer of ${op.amount} ${op.selling} at ${op.price} ${op.buying} / unit`
  case "manageData":
    if (op.value) {
      if (op.value.type === "text") {
        return `Set data entry '${op.name}' to: '${op.value.value}'`
      } else {
        return `Set data entry '${op.name}' to base64: '${op.value.value}'`
      }
    } else {
      return `Delete data entry '${op.name}'`
    }
  case "manageBuyOffer":
    if (!op.offerId || op.offerId === "0") {
      return `Offer to buy ${op.buyAmount} ${op.buying} at \
${op.price} ${op.buying} / unit`
    } else if (op.buyAmount !== "0") {
      return `Change offer '${op.offerId}' to: offer to buy \
${op.buyAmount} ${op.buying} at ${op.price} ${op.buying} / unit`
    } else {
      return `Delete offer '${op.offerId}'`
    }
  case "manageSellOffer":
    if (!op.offerId || op.offerId === "0") {
      return `Offer to sell ${op.amount} ${op.selling} at ${op.price} ${op.buying} / unit`
    } else if (op.amount !== "0") {
      return `Change offer to sell '${op.offerId}' to: offer ${op.amount} ${op.selling} at ${op.price} ${op.buying} / unit`
    } else {
      return `Delete offer '${op.offerId}'`
    }
  case "pathPaymentStrictReceive":
    return `Send ${op.destAmount} ${op.destAsset} to ${op.destination} for a maximum of ${op.sendMax} ${op.sendAsset}`
  case "pathPaymentStrictSend":
    return `Send a minimum of ${op.destMin} ${op.destAsset} to ${op.destination} for ${op.sendAmount} ${op.sendAsset}`
  case "payment":
    return `Send ${op.amount} ${op.asset} to ${op.destination}`
  case "setOptions":
    msg = []
    if (op.inflationDest) {
      msg.push(`Set inflation destination to: ${op.inflationDest}`)
    }
    if (op.clearFlags) {
      msg.push(`Clear flag(s): ${op.clearFlags}`)
    }
    if (op.setFlags) {
      msg.push(`Set flag(s): ${op.setFlags}`)
    }
    if (op.masterWeight) {
      if (op.masterWeight === "0") {
        msg.push(`Delete master key`)
      } else {
        msg.push(`Set master key weight to: ${op.masterWeight}`)
      }
    }
    ["lowThreshold", "medThreshold", "highThreshold"].forEach(field => {
      if (field in op) {
        msg.push(`Set ${field} to: ${op[field]}`)
      }
    })
    if (op.signer) {
      if (op.signer.type === "tx") {
        if (op.signer.weight === "0") {
          msg.push(`Remove pre-signed transaction ${op.signer.value}`)
        } else {
          msg.push(`Pre-sign transaction ${op.signer.value}`)
        }
      } else {
        if (op.signer.weight === "0") {
          msg.push(`Remove signer: ${op.signer.type} ${op.signer.value}`)
        } else {
          msg.push(
            `Set signer ${op.signer.type} ${op.signer.value} weight to ${op.signer.weight}`
          )
        }
      }
    }
    if (op.homeDomain !== undefined) {
      if (op.homeDomain.length) {
        msg.push(`Set home domain to: ${op.homeDomain}`)
      } else {
        msg.push(`Unset home domain`)
      }
    }
    if (!msg.length) {
      msg.push("Do nothing")
    }
    if (msg.length === 1) {
      return msg[0]
    } else {
      return `${msg[0]} [...]`
    }
  }
}

/* Rules: fields */
encode.address = function (address) {
  return aliases.all[address] || shorter(address)
}

encode.asset = function (asset) {
  if (asset.issuer) {
    return `${asset.code}:${encode.address(asset.issuer)}`
  } else {
    return "XLM"
  }
}

encode.amount = function (amount) {
  return nice(amount)
}

encode.data = function (data) {
  return data.value
}

encode.flags = function (flags) {
  let string = ""
  if (flags >= 4) {
    string = "immutable"
    flags = flags - 4
  }
  if (flags >= 2) {
    if (string) string += ", "
    string += "revocable"
    flags = flags - 2
  }
  if (+flags === 1) {
    if (string) string += ", "
    string += "required"
  }
  return string
}

encode.price = function (price) {
  if (typeof price === "string") {
    return nice(price)
  } else {
    return nice(price.n / price.d)
  }
}

encode.signer = function (signer) {
  const ret = Object.assign({}, signer)
  ret.value = encode.address(ret.value)
  return ret
}

encode.url = function (url) {
  if (url.match(/^https:\/\//)) {
    return url.substr(8)
  }
}

/* Export */
module.exports = { encode }
