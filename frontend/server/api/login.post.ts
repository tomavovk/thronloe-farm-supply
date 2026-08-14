import { createSession, findUserByEmail, publicUser } from '../utils/mock-state'

// POST /api/login → { token, refresh_token, user }
export default defineEventHandler(async (event) => {
  const { email, password } = await readBody<{ email?: string; password?: string }>(event)
  const user = email ? findUserByEmail(email) : undefined

  if (!user || user.password !== password) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'That email and password don’t match',
    })
  }

  return { ...createSession(user.id), user: publicUser(user) }
})
