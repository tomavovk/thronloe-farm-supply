import { useStorage } from '@vueuse/core'

export interface SessionUser {
  id: number
  email: string
  name: string
  scope: string[]
  isActive: boolean
}

interface Tokens {
  token: string
  refresh_token: string
}

// Client-side session for the mock API: tokens in localStorage, the user in Nuxt
// state so SSR and hydration agree. `@sidebase/nuxt-auth` stays configured in
// nuxt.config but idle — its local provider wants cookie-based tokens and a fixed
// endpoint shape, and this contract is ours; swapping to it later is a small change
// confined to this file plus useApi().
export const useSession = () => {
  const tokens = useStorage<Tokens | null>('tfs_session', null, undefined, {
    serializer: {
      read: (raw) => (raw ? (JSON.parse(raw) as Tokens) : null),
      write: (value) => JSON.stringify(value),
    },
  })

  const user = useState<SessionUser | null>('session:user', () => null)

  const signedIn = computed(() => !!tokens.value?.token)

  const setSession = (payload: Tokens & { user?: SessionUser }) => {
    tokens.value = { token: payload.token, refresh_token: payload.refresh_token }

    if (payload.user) {
      user.value = payload.user
    }
  }

  const clear = () => {
    tokens.value = null
    user.value = null
  }

  return { tokens, user, signedIn, setSession, clear }
}
