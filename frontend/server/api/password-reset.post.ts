import { findUserByEmail, issueToken, useMockState } from '../utils/mock-state'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/password-reset — step 1 of the forgot-password flow. Always answers
// 202 with the address it "sent" to, whether or not the account exists: telling a
// caller which emails are registered is an account-enumeration leak.
export default defineEventHandler(async (event) => {
  const { email } = await readBody<{ email?: string }>(event)

  if (!email || !EMAIL.test(email.trim())) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Unprocessable Entity',
      message: 'Enter the email on your account',
      data: { errors: { email: 'Enter the email on your account' } },
    })
  }

  const address = email.trim()
  const user = findUserByEmail(address)

  if (user) {
    const state = useMockState()
    const token = issueToken('reset')
    state.resetTokens.set(token, user.id)
  }

  setResponseStatus(event, 202)

  // The token is deliberately not returned — the reset page accepts any token in
  // this mock, and a real API would only ever put it in the email.
  return { sentTo: address, expiresInMinutes: 30 }
})
