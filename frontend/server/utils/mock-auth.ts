import type { H3Event } from 'h3'
import { useMockState, type MockUser } from './mock-state'

// Bearer-token gate for the account endpoints. Mirrors what a real API does: no or
// unknown token → 401, which is what useApi()'s refresh-and-retry flow expects.
export const requireUser = (event: H3Event): MockUser => {
  const header = getRequestHeader(event, 'authorization') ?? ''
  const token = header.replace(/^Bearer\s+/i, '').trim()
  const state = useMockState()
  const userId = token ? state.sessions.get(token) : undefined

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Sign in to continue',
    })
  }

  const user = state.users.find((candidate) => candidate.id === userId)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Sign in to continue',
    })
  }

  return user
}
