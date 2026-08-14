<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <VoltToast />
  </div>
</template>

<script setup lang="ts">
import { localBusinessSchema, organizationSchema } from '~/shared/utils/schema'

useHead({ htmlAttrs: { lang: 'en' } })

// Site-wide structured data: who the company is, and the storefront that local
// search reads (address, phone, the season's opening hours). Page-specific nodes
// reference these by @id — see index.vue (WebSite) and product/[id].vue (Product).
const now = new Date()

useJsonld(() => organizationSchema())
useJsonld(() => localBusinessSchema(now))
</script>
