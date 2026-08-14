import { useMockState } from '../../utils/mock-state'

// POST /api/token/invalidate — sign out. Drops the bearer token and, when given,
// the refresh token too. Always 204: signing out twice isn't an error.
export default defineEventHandler(async (event) => {
  const state = useMockState()
  const header = getRequestHeader(event, 'authorization') ?? ''
  const token = header.replace(/^Bearer\s+/i, '').trim()

  if (token) {
    state.sessions.delete(token)
  }

  const body = await readBody<{ refresh_token?: string }>(event).catch(() => null)

  if (body?.refresh_token) {
    state.refreshTokens.delete(body.refresh_token)
  }

  setResponseStatus(event, 204)

  return null
})
