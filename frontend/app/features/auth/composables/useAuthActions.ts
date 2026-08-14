import type { SessionUser } from '~/shared/composables/useSession'

interface SessionResponse {
  token: string
  refresh_token: string
  user: SessionUser
}

// The four auth screens all do the same three things: post, store the session,
// land on /account. Keeping that here means each page is just its form.
export const useAuthActions = () => {
  const api = useApi()
  const router = useRouter()
  const { setSession, clear, tokens } = useSession()

  const enter = (session: SessionResponse) => {
    setSession(session)

    return router.push('/account')
  }

  const login = async (body: { email: string; password: string }) =>
    enter(await api<SessionResponse>('/login', { method: 'POST', body }))

  const register = async (body: Record<string, unknown>) =>
    enter(await api<SessionResponse>('/register', { method: 'POST', body }))

  const requestPasswordReset = (email: string) =>
    api<{ sentTo: string; expiresInMinutes: number }>('/password-reset', {
      method: 'POST',
      body: { email },
    })

  const changePassword = async (body: { password: string; passwordRepeat: string }) =>
    enter(await api<SessionResponse>('/password-change', { method: 'POST', body }))

  const signOut = async () => {
    // Best effort: the session is gone locally either way.
    if (tokens.value?.token) {
      await api('/token/invalidate', {
        method: 'POST',
        body: { refresh_token: tokens.value.refresh_token },
      }).catch(() => {})
    }

    clear()

    return router.push('/login')
  }

  return { login, register, requestPasswordReset, changePassword, signOut }
}
