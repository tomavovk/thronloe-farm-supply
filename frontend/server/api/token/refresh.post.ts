import { createSession, useMockState } from '../../utils/mock-state'

// POST /api/token/refresh — swaps a refresh token for a fresh pair. The old refresh
// token is dropped (rotation), so a replay gets 401.
export default defineEventHandler(async (event) => {
  const body = await readBody<{ refresh_token?: string }>(event)
  const state = useMockState()
  const token = body?.refresh_token ?? ''
  const userId = token ? state.refreshTokens.get(token) : undefined

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'That refresh token is no longer valid',
    })
  }

  state.refreshTokens.delete(token)

  return createSession(userId)
})
