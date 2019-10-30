/* eslint-env jasmine */
"use strict"

const $status = require("../../src/lib/status")

const { any } = jasmine

/* Globals */
let status

/* Helpers */

it.isVerbose = function (level, method, type = method) {
  it(`has a verbosity level of ${level}`, () => {
    spyOn(console, type)
    status.verbosity = level - 1
    status[method]("foo")
    // eslint-disable-next-line no-console
    expect(console[type]).not.toHaveBeenCalled()

    status.locked = false
    status.verbosity = level
    status[method]("foo")
    // eslint-disable-next-line no-console
    expect(console[type]).toHaveBeenCalled()
  })
}

/* Specs */

describe("$status instance", () => {
  beforeEach(() => status = $status({}))

  it("has initial values", () => {
    expect(status.verbosity).toBe(2)
    expect(status.state).toBe(null)
    expect(status.locked).toBe(false)
    expect(status.failed).toBe(false)
    expect(status.messages).toEqual([])
    expect(status.source).toEqual({})
  })

  describe(".log()", () => {
    it.isVerbose(2, "log")

    it("logs a message", () => {
      status.log("message")
      expect(status.messages.length).toBe(1)
      expect(status.messages[0]).toEqual(["log", "message"])
    })
  })

  describe(".warn()", () => {
    it.isVerbose(1, "warn")

    it("logs a warning message", () => {
      status.warn("message")
      expect(status.messages.length).toBe(1)
      expect(status.messages[0]).toEqual(["warn", "message"])
    })
  })

  describe(".error()", () => {
    it.isVerbose(1, "error")

    it("logs an error message", () => {
      status.error("message")
      expect(status.messages.length).toBe(1)
      expect(status.messages[0]).toEqual(["error", "message"])
    })

    it("returns an error", () => {
      const error = status.error("error-message")
      expect(error).toEqual(any(Error))
    })
  })

  describe(".set()", () => {
    it.isVerbose(3, "set", "log")

    it("sets the state", () => {
      status.set("foo")
      expect(status.state).toBe("foo")
    })

    it("obeys to the `.locked` property", () => {
      status.locked = true
      status.set("foo")
      expect(status.state).toBe(null)
    })
  })

  describe(".lock()", () => {
    it.isVerbose(3, "lock", "log")

    it("lock the state", () => {
      status.lock("foo")
      expect(status.state).toBe("foo")
      expect(status.locked).toBe(true)

      status.set("bar")
      expect(status.state).toBe("foo")
    })
  })

  describe(".fail()", () => {
    it.isVerbose(1, "fail", "error")

    it("set the state", () => {
      status.fail("foo")
      expect(status.state).toBe("foo")
    })

    it("lock the state", () => {
      status.fail()
      expect(status.locked).toBe(true)
      expect(status.state).toBe(null)
    })

    it("returns an error", () => {
      const error = status.fail("foo")
      expect(error).toEqual(any(Error))
      expect(error.message).toBe("foo")
    })
  })
})
