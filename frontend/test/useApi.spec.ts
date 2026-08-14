// @vitest-environment nuxt
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime'
import { createError, defineEventHandler, readBody } from 'h3'
import { apiFieldErrors, apiMessage, useApi } from '~/shared/composables/useApi'

// The refresh-on-401 dance is the one piece of logic here that can lose a user's
// session or stampede the backend, and it is invisible until it misbehaves.
//
// Driven through real endpoints (registerEndpoint) rather than a stubbed $fetch, so
// the request hook that attaches the bearer token is exercised too.

const { useSessionMock } = vi.hoisted(() => ({ useSessionMock: vi.fn() }))

mockNuxtImport('useSession', () => useSessionMock)

interface Recorded {
  url: string
  auth: string | undefined
  body?: unknown
}

/** Set per test: how the fake backend should answer. */
let respond: (url: string, recorded: Recorded) => unknown
let calls: Recorded[]
let session: {
  tokens: Ref<{ token: string; refresh_token: string } | null>
  setSession: ReturnType<typeof vi.fn>
  clear: ReturnType<typeof vi.fn>
}

const endpoint = (url: string) =>
  registerEndpoint(url, {
    method: 'GET',
    handler: defineEventHandler((event) => {
      const recorded = { url, auth: event.headers.get('authorization') ?? undefined }
      calls.push(recorded)

      return respond(url, recorded)
    }),
  })

endpoint('/api/a')
endpoint('/api/b')
endpoint('/api/c')
endpoint('/api/user/info')
endpoint('/api/products')

registerEndpoint('/api/token/refresh', {
  method: 'POST',
  handler: defineEventHandler(async (event) => {
    const recorded = {
      url: '/token/refresh',
      auth: event.headers.get('authorization') ?? undefined,
      body: await readBody(event),
    }
    calls.push(recorded)

    return respond('/token/refresh', recorded)
  }),
})

beforeEach(() => {
  calls = []
  respond = () => ({ ok: true })
  session = {
    tokens: ref({ token: 'access-1', refresh_token: 'refresh-1' }),
    setSession: vi.fn(),
    clear: vi.fn(),
  }
  useSessionMock.mockReturnValue(session)
})

const unauthorized = () => createError({ statusCode: 401, statusMessage: 'Unauthorized' })

describe('useApi', () => {
  it('returns the response body and attaches the bearer token', async () => {
    respond = () => ({ items: [1, 2] })

    await expect(useApi()('/products')).resolves.toEqual({ items: [1, 2] })
    expect(calls).toHaveLength(1)
    expect(calls[0]!.auth).toBe('Bearer access-1')
  })

  it('sends no Authorization header when signed out', async () => {
    session.tokens.value = null

    await useApi()('/products')

    expect(calls[0]!.auth).toBeUndefined()
  })

  it('rethrows non-401 errors without touching the session', async () => {
    respond = () => {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    await expect(useApi()('/products')).rejects.toMatchObject({ status: 403 })
    expect(calls).toHaveLength(1)
    expect(session.clear).not.toHaveBeenCalled()
    expect(session.setSession).not.toHaveBeenCalled()
  })

  it('lets ofetch retry a 500 once — its default, not ours', async () => {
    respond = () => {
      throw createError({ statusCode: 500, statusMessage: 'Server Error' })
    }

    await expect(useApi()('/products')).rejects.toMatchObject({ status: 500 })
    // 500 is in ofetch's retryStatusCodes, so the transport tries twice before the
    // error surfaces. Worth knowing: a failing write is not necessarily sent once.
    expect(calls).toHaveLength(2)
    expect(session.clear).not.toHaveBeenCalled()
  })

  it('on 401: refreshes, stores the new tokens and retries once', async () => {
    let attempts = 0
    respond = (url) => {
      if (url === '/token/refresh') {
        return { token: 'access-2', refresh_token: 'refresh-2' }
      }

      attempts++

      if (attempts === 1) {
        throw unauthorized()
      }

      return { profile: { name: 'Jane' } }
    }

    await expect(useApi()('/user/info')).resolves.toEqual({ profile: { name: 'Jane' } })
    expect(calls.map((c) => c.url)).toEqual(['/api/user/info', '/token/refresh', '/api/user/info'])
    expect(session.setSession).toHaveBeenCalledWith({
      token: 'access-2',
      refresh_token: 'refresh-2',
    })
    expect(session.clear).not.toHaveBeenCalled()
  })

  it('sends the stored refresh token in the refresh body', async () => {
    respond = (url) => {
      if (url === '/token/refresh') {
        return { token: 'access-2', refresh_token: 'refresh-2' }
      }

      throw unauthorized()
    }

    await useApi()('/user/info').catch(() => {})

    expect(calls.find((c) => c.url === '/token/refresh')?.body).toEqual({
      refresh_token: 'refresh-1',
    })
  })

  it('with no refresh token: rethrows the 401 and never calls refresh', async () => {
    session.tokens.value = null
    respond = () => {
      throw unauthorized()
    }

    await expect(useApi()('/user/info')).rejects.toMatchObject({ status: 401 })
    expect(calls.map((c) => c.url)).toEqual(['/api/user/info'])
  })

  it('when refresh itself fails: clears the session and rethrows the original 401', async () => {
    respond = (url) => {
      throw url === '/token/refresh'
        ? createError({ statusCode: 400, statusMessage: 'Bad Request' })
        : unauthorized()
    }

    await expect(useApi()('/user/info')).rejects.toMatchObject({ status: 401 })
    expect(session.clear).toHaveBeenCalledTimes(1)
    // The original request is not retried after a failed refresh.
    expect(calls.filter((c) => c.url === '/api/user/info')).toHaveLength(1)
  })

  it('a burst of 401s triggers exactly one refresh', async () => {
    let refreshes = 0
    const seen = new Set<string>()

    respond = (url) => {
      if (url === '/token/refresh') {
        refreshes++

        return { token: 'access-2', refresh_token: 'refresh-2' }
      }

      if (seen.has(url)) {
        return { url }
      }

      seen.add(url)
      throw unauthorized()
    }

    const api = useApi()
    const results = await Promise.all([api('/a'), api('/b'), api('/c')])

    expect(results).toEqual([{ url: '/api/a' }, { url: '/api/b' }, { url: '/api/c' }])
    expect(refreshes).toBe(1)
  })

  it('retries with the refreshed token, not the stale one', async () => {
    let attempts = 0
    respond = (url) => {
      if (url === '/token/refresh') {
        // The composable stores tokens through setSession, which is mocked here —
        // so mirror what the real one does before the retry goes out.
        session.tokens.value = { token: 'access-2', refresh_token: 'refresh-2' }

        return { token: 'access-2', refresh_token: 'refresh-2' }
      }

      attempts++

      if (attempts === 1) {
        throw unauthorized()
      }

      return { ok: true }
    }

    await useApi()('/user/info')

    const retried = calls.filter((c) => c.url === '/api/user/info')
    expect(retried[0]!.auth).toBe('Bearer access-1')
    expect(retried[1]!.auth).toBe('Bearer access-2')
  })
})

describe('error helpers', () => {
  const httpError = (status: number, data?: unknown) =>
    Object.assign(new Error(`HTTP ${status}`), { status, statusCode: status, data })

  it('pulls field errors out of a 422 body', () => {
    const error = httpError(422, { data: { errors: { email: 'Enter a valid email address' } } })

    expect(apiFieldErrors(error)).toEqual({ email: 'Enter a valid email address' })
  })

  it('returns an empty map when there are no field errors', () => {
    expect(apiFieldErrors(httpError(500))).toEqual({})
    expect(apiFieldErrors(undefined)).toEqual({})
  })

  it('prefers the API message and falls back to something showable', () => {
    expect(apiMessage(httpError(401, { message: 'Wrong email or password' }))).toBe(
      'Wrong email or password',
    )
    expect(apiMessage(httpError(500))).toBe('Something went wrong. Please try again.')
    expect(apiMessage(httpError(500), 'Could not send')).toBe('Could not send')
  })
})
