import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterAll, afterEach, beforeAll } from "vitest"
import { testBackend } from "../mocks/server.ts"
import { resetDatabase } from "../mocks/database.ts"
import { clearDroppedReply, setBackendOffline } from "../mocks/services.ts"

beforeAll(() => {
  testBackend.listen({ onUnhandledFrame: "error" })
})

afterEach(() => {
  cleanup()
  testBackend.resetHandlers()
  resetDatabase()
  clearDroppedReply()
  setBackendOffline(false)
})

afterAll(() => {
  testBackend.close()
})
