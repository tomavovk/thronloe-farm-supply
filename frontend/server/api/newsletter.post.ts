import { useMockState } from '../utils/mock-state'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/newsletter — the footer sign-up.
export default defineEventHandler(async (event) => {
  const { email } = await readBody<{ email?: string }>(event)

  if (!email || !EMAIL.test(email.trim())) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Unprocessable Entity',
      message: 'Enter a valid email address',
      data: { errors: { email: 'Enter a valid email address' } },
    })
  }

  const state = useMockState()
  const address = email.trim().toLowerCase()

  // Re-subscribing is a no-op, not an error.
  if (!state.newsletter.includes(address)) {
    state.newsletter.push(address)
  }

  setResponseStatus(event, 201)

  return { subscribed: true }
})
