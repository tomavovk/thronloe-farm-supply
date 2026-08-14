import { createSession, publicUser, useMockState } from '../utils/mock-state'

// POST /api/password-change — step 2. A real API would require the emailed token;
// here any pending reset token works, and with none at all we fall back to the
// seeded account so the design's flow stays walkable.
export default defineEventHandler(async (event) => {
  const body = await readBody<{ token?: string; password?: string; passwordRepeat?: string }>(event)
  const errors: Record<string, string> = {}

  if ((body?.password ?? '').length < 8) {
    errors.password = 'Use at least 8 characters'
  }

  if (body?.password !== body?.passwordRepeat) {
    errors.passwordRepeat = 'The passwords don’t match'
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
  const userId = body.token ? state.resetTokens.get(body.token) : [...state.resetTokens.values()][0]
  const user = state.users.find((candidate) => candidate.id === (userId ?? 1))

  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'That reset link is no longer valid',
    })
  }

  user.password = body.password!

  if (body.token) {
    state.resetTokens.delete(body.token)
  }

  // Design: you're signed in straight after.
  return { ...createSession(user.id), user: publicUser(user) }
})
