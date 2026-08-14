<template>
  <div class="bg-panel text-ink text-sm">
    <div class="container-page flex h-11 items-center gap-4">
      <span
        class="border-line text-muted inline-flex items-center gap-[7px] border bg-panel px-3 py-[5px] text-xs font-medium leading-[1.4] whitespace-nowrap"
      >
        <SlIcon
          name="transfer-truck-time"
          class="text-[13px]"
        />
        DELIVERY
      </span>

      <span class="text-muted flex min-w-0 items-center gap-4 overflow-hidden font-medium">
        <span
          v-for="entry in site.delivery"
          :key="entry.text"
          class="inline-flex items-center gap-[7px] overflow-hidden text-ellipsis whitespace-nowrap"
        >
          <SlIcon
            :name="entry.icon as DesignIcon"
            class="text-[13px]"
          />
          {{ entry.text }}
        </span>
      </span>

      <div class="ml-auto hidden shrink-0 items-center gap-4 md:flex">
        <a
          :href="site.phoneHref"
          class="text-ink hover:text-brand flex items-center gap-1.5 font-medium transition-colors duration-[350ms]"
        >
          <SlIcon
            name="phone-ringing-1"
            class="text-[13px]"
          />
          {{ site.phone }}
        </a>
        <span class="bg-line h-4 w-px" />
        <a
          :href="site.facebookUrl"
          aria-label="Facebook"
          class="text-ink hover:text-brand flex items-center transition-colors duration-[350ms]"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DesignIcon } from '~/shared/constants/icons'

const { site } = useSite()
</script>
