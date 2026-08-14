type ApiOptions = Parameters<typeof $fetch>[1]

interface FetchErr {
  name?: string
  cause?: { name?: string }
  status?: number
  statusCode?: number
  data?: { message?: string; data?: { errors?: Record<string, string> } }
}

// Module-level: a burst of 401s triggers exactly one refresh.
let refreshing: Promise<boolean> | null = null

/**
 * Single point for HTTP requests (never call $fetch directly from a component).
 * Adds the API base URL and the bearer token, refreshes once on 401 and retries,
 * and rethrows aborts untouched so search-as-you-type can cancel freely.
 */
export const useApi = () => {
  const config = useRuntimeConfig()
  const { tokens, setSession, clear } = useSession()

  const instance = $fetch.create({
    baseURL: (config.public.apiBaseUrl as string) || '/api',
    onRequest({ options }) {
      if (tokens.value?.token) {
        options.headers.set('Authorization', `Bearer ${tokens.value.token}`)
      }
    },
  })

  const refresh = async () => {
    const refreshToken = tokens.value?.refresh_token

    if (!refreshToken) {
      return false
    }

    try {
      const next = await instance<{ token: string; refresh_token: string }>('/token/refresh', {
        method: 'POST',
        body: { refresh_token: refreshToken },
      })
      setSession(next)

      return true
    } catch {
      clear()

      return false
    }
  }

  return async <T = unknown>(url: string, opts?: ApiOptions): Promise<T> => {
    try {
      return (await instance<T>(url, opts)) as T
    } catch (e: unknown) {
      const err = e as FetchErr

      if (err?.name === 'AbortError' || err?.cause?.name === 'AbortError') {
        throw e
      }

      if ((err?.status ?? err?.statusCode) !== 401) {
        throw e
      }

      if (!refreshing) {
        refreshing = refresh().finally(() => {
          refreshing = null
        })
      }

      if (!(await refreshing)) {
        throw e
      }

      // Retry once — onRequest attaches the new token.
      return (await instance<T>(url, opts)) as T
    }
  }
}

/** Field errors from a 422 (`{ data: { errors: { field: message } } }`). */
export const apiFieldErrors = (error: unknown): Record<string, string> =>
  (error as FetchErr)?.data?.data?.errors ?? {}

/** Human-readable message from an API error, with a sane fallback. */
export const apiMessage = (error: unknown, fallback = 'Something went wrong. Please try again.') =>
  (error as FetchErr)?.data?.message ?? fallback
