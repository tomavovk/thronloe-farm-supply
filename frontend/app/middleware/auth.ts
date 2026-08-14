// Client-side guard for the account screens. The bearer token lives in
// localStorage, so the server can't know whether you're signed in — running this
// on the server would bounce every visit. Redirecting here (rather than in the
// page's onMounted) also stops the page from firing its API calls first and
// collecting a 401 on the way out.
export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) {
    return
  }

  const { signedIn } = useSession()

  if (!signedIn.value) {
    return navigateTo('/login', { replace: true })
  }
})
