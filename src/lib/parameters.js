"use strict"
/**
 * Parameters
 * */
const { LiveObject } = require("@kisbox/model")
const { xassoc } = require("@kisbox/helpers/compat/function")

/* Definition */

class Parameters extends LiveObject {}
const proto = Parameters.prototype

/* Utility */
Parameters.forEach = function (query, callback) {
  if (query[0] !== "?") throw new TypeError(`Not a query: ${query}`)

  query
    .substr(1)
    .split("&")
    .forEach(entry => {
      const key = entry.split("=")[0]
      const value = entry.substr(key.length + 1)
      callback(decodeURIComponent(value), key)
    })
}

/* Format: Query */
Parameters.fromQuery = function (query) {
  const params = new Parameters()

  Parameters.forEach(query, (value, key) => {
    params[key] = value
  })

  return params
}

proto.toQuery = function (prefix = "?") {
  let query = ""
  xassoc(this, (value, key) => {
    query += `&${key}=${encodeURIComponent(value)}`
  })

  return `${prefix}${query.substr(1)}`
}

/* Format: Json */
Parameters.fromJson = function (json) {
  return Object.assign(new Parameters(), JSON.parse(json))
}

proto.toJson = function () {
  return JSON.stringify(this, null, 2)
}

/* Export */
module.exports = Parameters
