"use strict"
/**
 * TxParams Format: Query
 */
const { xmap } = require("@kisbox/helpers")

const Parameters = require("../lib/parameters")
const $status = require("../lib/status")

/* Definition */
const encode = {},
  decode = {}

/* Rules: transaction */

encode.txAfter = function (tx) {
  let query = "?"

  let type, opsParams
  if (tx.operations.length === 1) {
    [type, opsParams] = tx.operations[0]
  } else {
    type = "transaction"
    opsParams = xmap(tx.operations, ([type, params]) => {
      if (!params.length) return `op=${type}`
      else return `op=${type}&${params}`
    }).join("&")
  }

  delete tx.operations
  const txParams = xmap(tx, (value, field) => `${field}=${value}`).join("&")

  query += `type=${type}`
  if (txParams) query += `&${txParams}`
  if (opsParams.length) query += `&${opsParams}`
  return query
}

decode.txBefore = function (tx, data) {
  if (data[0] !== "?") throw $status(tx).fail("Invalid query")

  // Backward compatibility with the old non-standard syntax, deprecated since
  // 2019-08-26. This adds `type=` at the beginning of the query when the first
  // parameter doesn't contains an `=` sign.
  if (data.match(/^\?\w+(&|$)/)) data = `?type=${data}`

  let parser
  Parameters.forEach(data, (value, field) => {
    if (field === "type") {
      if (parser) {
        throw $status(tx).error("Query declares 'type' several times.")
      } else if (value !== "transaction") {
        tx.operations[0] = { type: value }
      }
      parser = value
      return
    } else if (!parser) {
      throw $status(tx).error("Query doesn't declare 'type' in first position.")
    }

    if (field === "operation") {
      if (parser === "transaction" || parser === "operation") {
        tx.operations.push({ type: value })
        parser = "operation"
        return
      } else {
        throw $status(tx).error("Invalid parameter: operation.")
      }
    }

    if (parser === "transaction") {
      // Multi-operation link.
      tx[field] = value
    } else if (parser === "operation") {
      // One-operation link.
      tx.operations[tx.operations.length - 1][field] = value
    } else {
      if (tx.specs.isTxOptionalField(field)) {
        // if (tx.specs.isTxField(field)) {
        tx[field] = value
      } else {
        tx.operations[0][field] = value
      }
    }
  })

  // Move operations to the end of the object
  const operations = tx.operations
  delete tx.operations
  tx.operations = operations
}

/* Rules: operations */

encode.opAfter = function (op) {
  const type = op.type
  delete op.type
  const params = xmap(op, (value, field) => `${field}=${value}`).join("&")
  return [type, params]
}

/* Rules: fields */

encode.asset = function (asset) {
  if (asset.issuer) {
    const code = encodeURIComponent(asset.code)
    const issuer = encodeURIComponent(asset.issuer)
    return `${code}:${issuer}`
  }
}
decode.asset = function (asset) {
  const assetLower = asset.toLowerCase()
  if (assetLower === "xlm" || assetLower === "native") {
    return { code: "XLM" }
  } else {
    const [code, issuer] = asset.split(":")
    return { code, issuer }
  }
}

encode.assetPath = function (assetPath) {
  return assetPath.map(asset => encode.asset(asset)).toString()
}
decode.assetPath = function (assetsList) {
  return assetsList.split(",").map(decode.asset)
}

decode.authorizeFlag = function (flag) {
  if (!isNaN(+flag)) {
    return +flag
  } else {
    // Backward compatibility. (protocol =< 12)
    return decode.boolean(flag)
  }
}

encode.boolean = function (boolean) {
  if (boolean === false) return "false"
}
decode.boolean = function (string) {
  return string !== "false"
}

encode.buffer = function (buffer) {
  if (buffer.type === "text") {
    // Guard against prefix mis-interpretation.
    const decoded = decode.buffer(buffer.value)
    if (decoded.type === "text") return encodeURIComponent(buffer.value)
  } else if (buffer) {
    return `${buffer.type}:${encodeURIComponent(buffer.value)}`
  }
}
decode.buffer = function (string) {
  const matched = string.match(/(^[^:]*):/)
  const type = matched && matched[1]
  switch (type) {
  case "base64": {
    const value = string.substr(type.length + 1)
    return { type, value }
  }
  case "text":
    string = string.substr(type.length + 1)
    // Fallthrough
  default:
    return { type: "text", value: decode.string(string) }
  }
}

encode.date = function (date) {
  return date.replace(/Z$/, "")
}
decode.date = function (string) {
  // now + {minutes} syntactic sugar
  if (string.match(/^\+[0-9]+$/)) return string
  // Use UTC timezone by default.
  if (string.match(/T[^+]*[0-9]$/)) string += "Z"

  return new Date(string).toISOString()
}

encode.memo = function (memo) {
  if (memo.type === "text") {
    // Guard against prefix mis-interpretation.
    const decoded = decode.memo(memo.value)
    if (decoded.type === "text") return encodeURIComponent(memo.value)
  }
  return `${memo.type}:${encodeURIComponent(memo.value)}`
}
decode.memo = function (string) {
  const matched = string.match(/(^[^:]*):/)
  const type = matched && matched[1]

  switch (type) {
  case "base64":
  case "id":
  case "hash":
  case "return": {
    const value = string.substr(type.length + 1)
    return { type, value }
  }
  case "text":
    string = string.substr(type.length + 1)
    // Fallthrough
  default:
    return { type: "text", value: decode.string(string) }
  }
}

encode.price = function (price) {
  if (typeof price === "string") {
    return price
  } else {
    return `${price.n}:${price.d}`
  }
}
decode.price = function (string) {
  const [numerator, denominator] = string.split(":")

  if (!denominator) {
    return numerator
  } else {
    return { n: +numerator, d: +denominator }
  }
}

encode.signer = function (signer) {
  return `${signer.weight}:${signer.type}:${signer.value}`
}
decode.signer = function (string) {
  const [weight, type, value] = string.split(":")
  return { weight, type, value }
}

decode.string = function (string) {
  return string.replace(/\+/g, " ")
}

encode.url = function (url) {
  if (url.substr(0, 8) === "https://") {
    url = url.substr(8)
  }
  return encodeURIComponent(url)
}

decode.network = decode.string

// Defaults
encode["*"] = function (any) {
  return encodeURIComponent(any)
}

/* Export */
module.exports = { encode, decode }
