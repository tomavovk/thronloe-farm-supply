import { useMockState } from '../utils/mock-state'

interface Body {
  name?: string
  email?: string
  subject?: string
  message?: string
  consent?: boolean
}

// POST /api/contact — the same two rules the form enforces client-side, because an
// API can't trust the client.
export default defineEventHandler(async (event) => {
  const body = await readBody<Body>(event)
  const errors: Record<string, string> = {}

  if (!body?.subject?.trim()) {
    errors.subject = 'Tell us what this is about'
  }

  if (body?.consent !== true) {
    errors.consent = 'Please consent so we can reply'
  }

  if (Object.keys(errors).length) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Unprocessable Entity',
      message: 'Check the highlighted fields',
      data: { errors },
    })
  }

  const state = useMockState()
  const id = state.contactMessages.length + 1
  state.contactMessages.push({
    id,
    subject: body.subject!.trim(),
    receivedAt: new Date().toISOString(),
  })

  setResponseStatus(event, 201)

  return { id, message: 'Thanks — your message is on its way.' }
})
