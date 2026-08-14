// Injects a reactive <script type="application/ld+json"> block from a schema.org
// object (or array of them). Pass a getter returning null to emit nothing — e.g.
// while async product data is still loading. Builders live in shared/utils/schema.ts.
export const useJsonld = (data: MaybeRefOrGetter<object | null | undefined>) => {
  useHead(() => {
    const value = toValue(data)

    if (!value) {
      return {}
    }

    return {
      script: [
        {
          type: 'application/ld+json',
          // Escape `<` so a stray "</script>" inside product or page copy can't
          // break out of the script tag.
          innerHTML: JSON.stringify(value).replace(/</g, '\\u003c'),
        },
      ],
    }
  })
}
