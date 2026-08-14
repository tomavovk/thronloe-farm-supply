<template>
  <footer class="border-line mt-24 border-t bg-surface">
    <div class="container-page pt-16 pb-12">
      <p
        class="text-ink text-[clamp(2.4rem,6.5vw,5.5rem)] leading-[1.02] font-medium tracking-[-0.03em] text-balance"
      >
        Thornloe
        <span class="text-ink-soft">Farm Supply.</span>
      </p>
    </div>

    <div class="container-page">
      <div :class="[GRID, 'border-line border-t pb-8']">
        <div
          v-for="column in FOOTER_COLUMNS"
          :key="column.title"
        >
          <h3 :class="COL_TITLE">
            {{ column.title }}
          </h3>
          <ul class="flex list-none flex-col gap-2">
            <li
              v-for="link in column.links"
              :key="link.label"
            >
              <NuxtLink
                :to="link.to"
                aria-current-value="false"
                class="text-ink hover:text-brand text-sm font-medium transition-colors duration-[350ms]"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 :class="COL_TITLE">Newsletter</h3>
          <p class="text-muted mb-3 text-sm">Flyer deals &amp; event news, monthly.</p>
          <!-- The frame sits on the row so the button stays flush with the field
               (design: the input is bordered with `border-right: none`). -->
          <form
            class="border-line flex border focus-within:-outline-offset-1 focus-within:outline-2 focus-within:outline-brand"
            @submit.prevent="onSubscribe"
          >
            <VoltInputText
              v-model="email"
              bare
              type="email"
              placeholder="Email address"
              required
              aria-label="Email address"
              class="flex-1 px-3 py-[0.7rem] text-sm"
            />
            <button
              type="submit"
              class="bg-[image:var(--grad-btn)] bg-[length:220%_100%] bg-[position:0%_0] px-4 py-[0.7rem] text-sm font-medium text-white transition-[background-position] duration-[350ms] hover:bg-[position:100%_0]"
            >
              {{ subscribeLabel }}
            </button>
          </form>
          <p
            v-if="failure"
            class="text-badge mt-2 text-xs font-medium"
          >
            {{ failure }}
          </p>
        </div>
      </div>

      <div :class="[GRID, 'border-line border-t py-8']">
        <div>
          <h3 :class="COL_TITLE">Visit</h3>
          <address class="text-ink flex flex-col gap-2 text-sm not-italic">
            <span>{{ site.address }}</span>
            <a
              :href="site.phoneHref"
              :class="CONTACT_LINK"
            >
              {{ site.phone }}
            </a>
            <a
              :href="`mailto:${site.email}`"
              :class="CONTACT_LINK"
            >
              {{ site.email }}
            </a>
          </address>
        </div>

        <div
          v-for="season in site.hours"
          :key="season.title"
        >
          <h3 :class="COL_TITLE">
            {{ season.title }}
          </h3>
          <div class="text-ink flex flex-col gap-2 text-sm">
            <span class="text-muted">{{ season.season }}</span>
            <span
              v-for="row in season.rows"
              :key="row.days"
            >
              {{ row.days }}
              <span class="text-muted">{{ row.time }}</span>
            </span>
          </div>
        </div>
      </div>

      <div
        class="border-line text-muted grid grid-cols-1 items-center justify-items-center gap-3 border-t py-4 text-center text-xs md:grid-cols-[1fr_auto_1fr] md:justify-items-stretch md:text-left"
      >
        <span>© {{ year }} {{ site.legalName }}</span>
        <!-- Privacy / Terms have no page in the design yet (both links are inert
             there); they stay non-navigating until those pages exist. -->
        <div class="flex items-center gap-4">
          <span class="cursor-default">Privacy</span>
          <span class="cursor-default">Terms &amp; Conditions</span>
        </div>
        <span class="md:text-right">
          Prices in CAD ·
          <a
            href="https://www.streamlinehq.com"
            target="_blank"
            rel="noopener"
            class="hover:text-brand transition-colors duration-[350ms]"
          >
            Icons by Streamline
          </a>
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { FOOTER_COLUMNS } from '~/shared/constants/navigation'
const { site } = useSite()

// `.footer-grid` — the same 4-column layout for both the links row and the meta row.
const GRID =
  'grid gap-8 py-12 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-[.85fr_.85fr_.85fr_1.6fr]'
const COL_TITLE = 'text-muted mb-4 text-xs font-semibold tracking-[0.12em] uppercase'
const CONTACT_LINK = 'text-ink hover:text-brand font-medium transition-colors duration-[350ms]'

const api = useApi()

const email = ref('')
const subscribeLabel = ref('Sign Up')
const failure = ref('')
const year = new Date().getFullYear()

// POST /newsletter; the design's behaviour is the button flashing "Thanks!" for 2s.
const onSubscribe = async () => {
  failure.value = ''

  try {
    await api('/newsletter', { method: 'POST', body: { email: email.value } })
    subscribeLabel.value = 'Thanks!'
    email.value = ''

    setTimeout(() => {
      subscribeLabel.value = 'Sign Up'
    }, 2000)
  } catch (error) {
    failure.value = apiMessage(error, 'Could not sign you up. Please try again.')
  }
}
</script>
