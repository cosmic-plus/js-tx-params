"use strict"
/**
 * $status utility
 */
const { $util } = require("@kisbox/helpers/compat/meta")
const { wrap } = require("@kisbox/helpers/compat/object")

/* Configuration */

const defaults = {
  verbosity: 2,
  state: null,
  locked: false,
  failed: false
}

/* Definition */

const $status = $util(
  "/status/",
  wrap(defaults, {
    /* Constructor */
    constructor: function (source) {
      this.source = source
      this.messages = []
    },

    /* Methods */
    log (message) {
      this.messages.push(["log", message])
      /* eslint-disable-next-line no-console */
      if (this.verbosity > 1) console.log(message, ">>", this.source)
    },

    warn (message) {
      this.messages.push(["warn", message])
      if (this.verbosity > 0) console.warn(message, ">>", this.source)
    },

    error (message) {
      this.messages.push(["error", message])
      if (this.verbosity > 0) console.error(message, ">>", this.source)
      return new Error(message, this.source)
    },

    set (state) {
      if (this.locked) return
      this.state = state
      if (this.verbosity > 2) {
        /* eslint-disable-next-line no-console */
        console.log(`Set state: ${state}`, ">>", this.source)
      }
    },

    lock (state) {
      if (this.locked) return
      if (state !== undefined) this.set(state)
      this.locked = true
      /* eslint-disable-next-line no-console */
      if (this.verbosity > 2) console.log(`Lock state`, ">>", this.source)
    },

    fail (state) {
      if (this.locked) return
      this.failed = true
      this.lock(state)
      if (this.verbosity > 2 || this.verbosity > 0 && !state) {
        console.error(`Failure`, ">>", this.source)
      } else if (this.verbosity > 0) {
        console.error(`Failure: ${state}`, ">>", this.source)
      }
      return new Error(state, this.source)
    }
  })
)

/* Export */
$status.defaults = defaults
module.exports = $status
