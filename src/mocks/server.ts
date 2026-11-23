import { setupServer } from "msw/node"
import { services } from "./services.ts"

export const testBackend = setupServer(...services)
