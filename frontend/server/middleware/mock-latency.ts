// Artificial latency for the mock API so loading states are actually exercised —
// a local handler answering in 1ms hides every skeleton and spinner.
//
// Applies to /api/** only, so pages and assets stay instant. Tune or switch off
// with MOCK_LATENCY_MS (0 disables); it lives with the mock and goes when the real
// backend arrives.
const RANGE = [100, 200] as const

const configured = Number(process.env.MOCK_LATENCY_MS ?? Number.NaN)

const delayFor = () => {
  if (Number.isFinite(configured)) {
    return Math.max(0, configured)
  }

  return RANGE[0] + Math.random() * (RANGE[1] - RANGE[0])
}

export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/')) {
    return
  }

  const ms = delayFor()

  if (ms > 0) {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }
})
