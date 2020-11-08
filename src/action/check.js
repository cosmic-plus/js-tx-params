"use strict"
/**
 * Check TxParams
 */
const { shorter, isBase64, isUtf8 } = require("@cosmic-plus/helpers")

const $status = require("../lib/status")

/* Constants */

const AUTHORIZE_FLAG_MAX = 2
const FEE_MAX = Math.pow(2, 32)
const FLAGS_MAX = 7
const WEIGHT_MAX = 255

const PUBKEY_REGEXP = /^G[A-D][A-Z0-9]{54}$/
const FEDERATED_REGEXP = /^[^*]+\*([\w-]+\.)+[\w]{2,}$/
const HASH_REGEXP = /^[0-9a-f]{64}$/

/* Definition */
const check = {}

/* Rules: transaction */

check.txBefore = function (tx) {
  if ($status(tx).state) {
    throw new Error("Invalid transaction", tx)
  }

  if (tx.operations.length > 100) {
    error(tx, `Too much operations (max: 100)`)
  }
}

check.txAfter = function (tx) {
  if ($status(tx).messages.length) {
    throw $status(tx).fail("Invalid transaction")
  }
}

/* Rules: operations */

check.opBefore = function (op, ctx) {
  // TODO: should work without `ctx`.
  if (!ctx.specs.isOpType(op.type)) {
    error(ctx, `Unknown operation: ${op.type}`)
  }

  ctx.specs.opMandatoryFields(op.type).forEach((field) => {
    if (!(field in op)) {
      error(ctx, `Missing parameter for '${op.type}': ${field}`)
    }
  })

  for (let field in op) {
    if (field === "type") continue
    if (!ctx.specs.isOpField(op.type, field)) {
      error(ctx, `Invalid parameter for '${op.type}': ${field}`)
    }
  }
}

/* Rules: fields */

check.amount = function (amount, ctx) {
  return checkNumber(ctx, amount, "amount", 0) || amount
}

check.address = function (address, ctx) {
  if (!address.match(PUBKEY_REGEXP) && !address.match(FEDERATED_REGEXP)) {
    const short = shorter(address)
    return error(ctx, `Invalid address: ${short}`)
  }
  return address
}

check.asset = function (asset, ctx) {
  if (!asset.code) {
    return error(ctx, `Missing asset code`)
  }
  if (asset.code.length > 14) {
    return error(ctx, `Asset code is too long (max 14 chars): ${asset.code}`)
  }
  if (!asset.issuer) {
    const code = asset.code.toLowerCase()
    if (code !== "xlm" && code !== "native") {
      return error(ctx, `Missing issuer for asset: ${code}`)
    }
  }
  return asset
}

check.assetPath = function (assetPath, ctx) {
  return assetPath.map((asset) => check.asset(asset, ctx))
}

check.authorizeFlag = function (flag, ctx) {
  return (
    checkInteger(ctx, flag, "authorize flag", 0, AUTHORIZE_FLAG_MAX) || flag
  )
}

check.boolean = function (boolean, ctx) {
  if (typeof boolean !== "boolean") {
    return error(ctx, `Not a boolean: ${boolean}`)
  }
  return boolean
}

check.buffer = function (buffer, ctx) {
  // TODO: check length.
  switch (buffer.type) {
  case "text":
    return checkUtf8(ctx, buffer.value) || buffer
  case "base64":
    return checkBase64(ctx, buffer.value) || buffer
  default:
    return error(ctx, `Invalid buffer type: ${buffer.type}`)
  }
}

check.date = function (date, ctx) {
  if (isNaN(Date.parse(date))) {
    return error(ctx, `Invalid date: ${date}`)
  } else {
    return date
  }
}

check.fee = function (fee, ctx) {
  return checkInteger(ctx, fee, "fees", 0, FEE_MAX) || fee
}

check.flags = function (flags, ctx) {
  return checkInteger(ctx, flags, "flags", 0, FLAGS_MAX) || flags
}

// TODO: review (buggy)
check.memo = function (memo, ctx) {
  switch (memo.type) {
  case "text":
    return checkUtf8(ctx, memo.value) || memo
  case "base64":
    return checkBase64(ctx, memo.value) || memo
  case "hash":
  case "return":
    return checkHash(ctx, memo.value) || memo
  case "id":
    return checkId(ctx, memo.value) || memo
  default:
    return error(ctx, `Invalid memo type: ${memo.type}`)
  }
}

check.price = function (price, ctx) {
  if (typeof price === "object") {
    try {
      checkNumber(ctx, price.n, null, 0)
      checkNumber(ctx, price.d, null, 0)
    } catch (error) {
      return error(ctx, `Invalid price: ${JSON.stringify(price)}`)
    }
  } else {
    checkNumber(ctx, price, "price", 0)
  }
  return price
}

check.signer = function (signer, ctx) {
  const output = {}

  output.weight = check.weight(signer.weight, ctx)
  output.type = signer.type
  switch (signer.type) {
  case "key":
    output.value = check.address(signer.value, ctx)
    break
  case "hash":
  case "tx":
    output.value = checkHash(ctx, signer.value) || signer.value
    break
  default:
    return error(`Invalid signer type: ${signer.type}`)
  }

  return output
}

check.sequence = function (sequence, ctx) {
  return checkInteger(ctx, Number(sequence), "sequence", 0) || sequence
}

check.threshold = function (threshold, ctx) {
  return checkInteger(ctx, threshold, "threshold", 0, WEIGHT_MAX) || threshold
}

check.weight = function (weight, ctx) {
  return checkInteger(ctx, weight, "weight", 0, WEIGHT_MAX) || weight
}

/* Helpers */

// TODO: move to `TxAction` ?
function error (ctx, message) {
  if (ctx) {
    return $status(ctx).error(message)
  } else {
    throw new Error(message)
  }
}

function checkInteger (ctx, value, type, min, max) {
  if (parseInt(value) + "" !== value + "") {
    return error(ctx, `Invalid ${type} (should be an integer): ${value}`)
  }
  return checkNumber(ctx, value, type, min, max)
}

// TODO: Fix no max issue
function checkNumber (ctx, value, type, min, max) {
  const num = +value
  if (isNaN(num)) {
    return error(ctx, `Invalid ${type} (should be a number): ${value}`)
  } else if (min && num < min || max && num > max) {
    return error(
      ctx,
      `Invalid ${type} (should be between ${min} and ${max}): ${value}`
    )
  }
}

function checkUtf8 (ctx, value) {
  if (typeof value !== "string" || !isUtf8(value)) {
    return error(ctx, `Invalid UTF8 string: ${value}`)
  }
}

function checkBase64 (ctx, value) {
  if (typeof value !== "string" || !isBase64(value)) {
    return error(ctx, `Invalid base64 string: ${value}`)
  }
}

function checkHash (ctx, hash) {
  if (!hash.match(HASH_REGEXP)) {
    return error(ctx, `Invalid hash: ${hash}`)
  }
}

function checkId (ctx, id) {
  if (!id.match(/^[0-9]*$/)) {
    return error(ctx, `Invalid id: ${id}`)
  }
}

/* Export */
module.exports = check
