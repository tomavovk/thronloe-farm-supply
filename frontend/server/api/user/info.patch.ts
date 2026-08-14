import type { ProfileUpdateResponse } from '#shared/types/account'
import { ACCOUNT_PROFILE } from '~/shared/constants/account'
import { requireUser } from '../../utils/mock-auth'
import { useMockState } from '../../utils/mock-state'

const FIELDS = Object.keys(ACCOUNT_PROFILE)
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// PATCH /api/user/info — partial update; unknown keys are ignored rather than
// silently stored, so a typo on the client can't invent profile fields.
export default defineEventHandler(async (event): Promise<ProfileUpdateResponse> => {
  const user = requireUser(event)
  const body = await readBody<Record<string, unknown>>(event)
  const state = useMockState()
  const profile = { ...(state.profiles.get(user.id) ?? ACCOUNT_PROFILE) }

  if (typeof body?.email === 'string' && body.email.trim() && !EMAIL.test(body.email.trim())) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Unprocessable Entity',
      message: 'Enter a valid email address',
      data: { errors: { email: 'Enter a valid email address' } },
    })
  }

  const ignored: string[] = []

  for (const [key, value] of Object.entries(body ?? {})) {
    if (!FIELDS.includes(key)) {
      ignored.push(key)
      continue
    }

    profile[key as keyof typeof profile] = typeof value === 'string' ? value : ''
  }

  state.profiles.set(user.id, profile)

  // Keep the session's display name and email in step with the profile.
  if (typeof body?.name === 'string' && body.name.trim()) {
    user.name = body.name.trim()
  }

  if (typeof body?.email === 'string' && body.email.trim()) {
    user.email = body.email.trim()
  }

  return { profile, ignored }
})
