import { ACCOUNT_PROFILE } from '~/shared/constants/account'
import { createSession, findUserByEmail, publicUser, useMockState } from '../utils/mock-state'

interface Body {
  name?: string
  email?: string
  password?: string
  passwordRepeat?: string
  phone?: string
  farm?: string
  address1?: string
  address2?: string
  city?: string
  province?: string
  postal?: string
  preferredRun?: string
}

// POST /api/register — creates the account and signs it in, like the design does.
// The optional block is stored straight into the profile so /account shows it.
export default defineEventHandler(async (event) => {
  const body = await readBody<Body>(event)
  const errors: Record<string, string> = {}

  if (!body?.name?.trim()) {
    errors.name = 'Enter your full name'
  }

  if (!body?.email?.trim()) {
    errors.email = 'Enter your email'
  }

  if ((body?.password ?? '').length < 8) {
    errors.password = 'Use at least 8 characters'
  }

  if (body?.password !== body?.passwordRepeat) {
    errors.passwordRepeat = 'The passwords don’t match'
  }

  if (body?.email && findUserByEmail(body.email)) {
    errors.email = 'That email already has an account'
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
  const user = {
    id: Math.max(...state.users.map((candidate) => candidate.id)) + 1,
    email: body.email!.trim(),
    password: body.password!,
    name: body.name!.trim(),
    scope: ['ROLE_USER'],
  }

  state.users.push(user)
  state.profiles.set(user.id, {
    ...ACCOUNT_PROFILE,
    name: user.name,
    email: user.email,
    phone: body.phone ?? '',
    farm: body.farm ?? '',
    bill_addr1: body.address1 ?? '',
    bill_addr2: body.address2 ?? '',
    bill_city: body.city ?? '',
    bill_prov: body.province ?? '',
    bill_postal: body.postal ?? '',
    pref: body.preferredRun ?? '',
  })
  // A brand-new account has no history.
  state.orders.set(user.id, [])

  setResponseStatus(event, 201)

  return { ...createSession(user.id), user: publicUser(user) }
})
