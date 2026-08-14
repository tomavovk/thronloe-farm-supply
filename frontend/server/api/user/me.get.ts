import { requireUser } from '../../utils/mock-auth'
import { publicUser } from '../../utils/mock-state'

// GET /api/user/me — the session probe. Nested under `user` so a token-less call
// returns 401, which is what the client's refresh-and-retry flow keys on.
export default defineEventHandler((event) => ({ user: publicUser(requireUser(event)) }))
