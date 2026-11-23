/// <reference types="msw/vite/client" />

export async function startBackend() {
  const { network } = await import("virtual:msw")
  const { services } = await import("./services.ts")

  // "bypass": requests we don't mock (thumbnail images) go to the real network without a warning.
  network.configure({ handlers: services, onUnhandledFrame: "bypass" })
  await network.enable()
}
