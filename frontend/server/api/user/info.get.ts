import type { ProfileResponse } from '#shared/types/account'
import { ACCOUNT_PROFILE } from '~/shared/constants/account'
import { requireUser } from '../../utils/mock-auth'
import { useMockState } from '../../utils/mock-state'

// GET /api/user/info — the profile behind the Account tab.
export default defineEventHandler((event): ProfileResponse => {
  const user = requireUser(event)
  const profile = useMockState().profiles.get(user.id)

  return { profile: profile ?? { ...ACCOUNT_PROFILE } }
})
