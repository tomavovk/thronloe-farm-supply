import type { ApiProfile } from '#shared/types/account'
import { ACCOUNT_PROFILE, ORDERS, type Order } from '~/shared/constants/account'

// In-memory state for the mock API. Module scope means it lives as long as the
// Nitro process: a PATCH to the profile is visible to the next GET, a login token
// keeps working until restart. Nothing is persisted — that's the point.
//
// When the real backend lands, delete server/api and point API_BASE_URL at it.

export interface MockUser {
  id: number
  email: string
  password: string
  name: string
  scope: string[]
}

interface State {
  users: MockUser[]
  /** access token → user id */
  sessions: Map<string, number>
  /** refresh token → user id */
  refreshTokens: Map<string, number>
  /** password-reset token → user id */
  resetTokens: Map<string, number>
  profiles: Map<number, ApiProfile>
  orders: Map<number, Order[]>
  contactMessages: { id: number; subject: string; receivedAt: string }[]
  newsletter: string[]
}

const SEED_USER: MockUser = {
  id: 1,
  // Test credentials for the mock API — the sign-in form hints at these.
  email: 'admin@example.com',
  password: 'String1!',
  name: ACCOUNT_PROFILE.name,
  scope: ['ROLE_USER'],
}

const state: State = {
  users: [SEED_USER],
  sessions: new Map(),
  refreshTokens: new Map(),
  resetTokens: new Map(),
  profiles: new Map([[SEED_USER.id, { ...ACCOUNT_PROFILE }]]),
  orders: new Map([[SEED_USER.id, ORDERS]]),
  contactMessages: [],
  newsletter: [],
}

export const useMockState = () => state

let counter = 0

/** Opaque token — deterministic enough to debug, unique enough to be a session. */
export const issueToken = (prefix: string) =>
  `${prefix}_${++counter}_${Math.random().toString(36).slice(2, 10)}`

export const findUserByEmail = (email: string) =>
  state.users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase())

export const createSession = (userId: number) => {
  const token = issueToken('at')
  const refreshToken = issueToken('rt')
  state.sessions.set(token, userId)
  state.refreshTokens.set(refreshToken, userId)

  return { token, refresh_token: refreshToken }
}

export const publicUser = (user: MockUser) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  scope: user.scope,
  isActive: true,
})
